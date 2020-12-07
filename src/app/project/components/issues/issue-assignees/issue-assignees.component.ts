import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { JIssue } from '@trungk18/interface/issue';
import { JUser } from '@trungk18/interface/user';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { UsersService } from '@trungk18/project/services/users.service';
import { IssueStatusService } from '@trungk18/project/services/issue-status.service';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectsService } from '@trungk18/project/services/projects.service';

@Component({
  selector: 'issue-assignees',
  templateUrl: './issue-assignees.component.html',
  styleUrls: ['./issue-assignees.component.scss']
})
@UntilDestroy()
export class IssueAssigneesComponent implements OnInit, OnChanges {
  @Input() issue: JIssue;
  @Input() projectsId: number;
  currentUserId: string = localStorage.getItem('token');
  currentUser: JUser;
  users: any;
  assignees: JUser[] = [];
  nameProject: string = '';
  checkAdmin = false;

  constructor(private issuesService: IssuesService,
    private usersService: UsersService,
    private issueStatusService: IssueStatusService,
    private projectsService: ProjectsService,
    public authQuery: AuthQuery) {
    }

  ngOnInit(): void {
    this.usersService.getUsersById(this.currentUserId).subscribe(
      (data) => {
        if (data[0]) {
          this.currentUser = data[0];
          this.checkAdmin = this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString());
        }
      }
    )
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges) {
    let issueChange = changes.issue;
    if (this.users && issueChange.currentValue !== issueChange.previousValue) { }
  }

  async getData() {
    let projectId = this.issueStatusService.getProjectIdByStatusId(this.issue.issueStatusId);
    if (projectId) {
      this.usersService.getUsersInProjects(this.projectsId).subscribe (
        (data) => {
          this.users = data;
        }
      )
    }

    this.assignees = [];
    let userIds = this.issuesService.getListUsersInIssue(this.issue.id);
    if (userIds) {
      for (let i = 0; i < userIds.length; i++) {
        let getUsersById = this.usersService.getUsersById(userIds[i]).toPromise().then(
          (data) => {
            this.assignees.push(data[0]);
          }
        )
        await Promise.all([getUsersById]);
      }
    }
  }

  removeUser(userId: string) {
    let userIds = this.issuesService.getListUsersInIssue(this.issue.id);
    let newUserIds = userIds.filter((x) => x !== userId);
    this.issuesService.updateIssue({
      ...this.issue,
      userIds: newUserIds
    });
    this.getData();
  }

  addUserToIssue(user: JUser) {
    let userIds = this.issuesService.getListUsersInIssue(this.issue.id);
    this.issuesService.updateIssue({
      ...this.issue,
      userIds: [...userIds, user.id]
    });
    this.getData();
  }

  isUserSelected(user: JUser): boolean {
    let userIds = this.issuesService.getListUsersInIssue(this.issue.id);
    return userIds.includes(user.id);
  }
}
