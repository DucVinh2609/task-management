import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
export class IssueAssigneesComponent implements OnInit {
  @Input() issue: JIssue;
  @Input() projectsId: number;
  @Output() onChange = new EventEmitter<boolean>();
  currentUserId: string = localStorage.getItem('token');
  currentUser: JUser;
  users: any;
  assignees: JUser[] = [];
  nameProject: string = '';
  checkAdmin = false;
  userIds: string;
  load: boolean = false;

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

  async getData() {
    let projectId = '';
    let getProjectIdByStatusId = this.issueStatusService.getProjectIdByStatusId(this.issue.issueStatusId).toPromise().then(
      (data) => {
        projectId = data[0].projectId;
      }
    )
    await Promise.all([getProjectIdByStatusId]);

    if (projectId) {
      let getUsersInProjects = this.usersService.getUsersInProjects(this.projectsId).toPromise().then(
        (data) => {
          this.users = data;
        }
      )
      await Promise.all([getUsersInProjects]);
    }

    this.assignees = [];
    let userIds = '';
    let getInfoIssue = this.issuesService.getInfoIssue(this.issue.id).toPromise().then(
      (data) => {
        this.userIds = userIds = data[0].userIds;
      }
    )
    await Promise.all([getInfoIssue]);
    if (userIds.split(',').length > 0) {
      for (let i = 0; i < userIds.split(',').length; i++) {
        if (userIds.split(',')[i]) {
          let getUsersById = this.usersService.getUsersById(userIds.split(',')[i]).toPromise().then(
            (data) => {
              this.assignees.push(data[0]);
            }
          )
          await Promise.all([getUsersById]);
        } else {
          this.assignees = [];
        }
      }
    }
    this.load = true;
  }

  async removeUser(userId: string) {
    let userIds = '';
    let getInfoIssue = this.issuesService.getInfoIssue(this.issue.id).toPromise().then(
      (data) => {
        userIds = data[0].userIds;
      }
    )
    await Promise.all([getInfoIssue]);
    let listUserIds = userIds.split(',');
    let listNewUserIds = listUserIds.filter((x) => x !== userId);
    let newUserIds = listNewUserIds.join(',');
    this.issuesService.updateIssue({
      ...this.issue,
      userIds: newUserIds
    }).subscribe(
      () => {
        this.onChange.emit(true);
      }
    );
    this.getData();
  }

  async addUserToIssue(user: JUser) {
    let userIds = '';
    let getInfoIssue = this.issuesService.getInfoIssue(this.issue.id).toPromise().then(
      (data) => {
        userIds = data[0].userIds;
      }
    )
    await Promise.all([getInfoIssue]);
    let listUserIds = userIds.split(',');
    let listNewUserIds = listUserIds.concat(user.id);
    let newUserIds = listNewUserIds.join(',');
    this.issuesService.updateIssue({
      ...this.issue,
      userIds: newUserIds
    }).subscribe(
      () => {
        this.getData();
        this.onChange.emit(true);
      }
    );
  }

  isUserSelected(user: JUser): boolean {
    if (this.userIds) {
      return this.userIds.split(',').includes(user.id);
    } else {
      return false;
    }
  }
}
