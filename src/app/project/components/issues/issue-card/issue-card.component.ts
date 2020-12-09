import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { JIssue } from '@trungk18/interface/issue';
import { IssuePriorityIcon } from '@trungk18/interface/issue-priority-icon';
import { JUser } from '@trungk18/interface/user';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { IssueUtil } from '@trungk18/project/utils/issue';
import { NzModalService } from 'ng-zorro-antd/modal';
import { IssueModalComponent } from '../issue-modal/issue-modal.component';
import { UsersService } from 'src/app/project/services/users.service';
import { IssueTypesService } from 'src/app/project/services/issue-types.service';
import { IssuesService } from 'src/app/project/services/issues.service';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectsService } from '@trungk18/project/services/projects.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'issue-card',
  templateUrl: './issue-card.component.html',
  styleUrls: ['./issue-card.component.scss']
})
@UntilDestroy()
export class IssueCardComponent implements OnChanges {
  @Input() issue: JIssue;
  assignees: JUser[] = [];
  issueTypeIcon: string;
  priorityIcon: IssuePriorityIcon;
  projectsId: number;
  nameProject: string = '';
  deadline: string = '';
  deadlineAt: Date;
  month: number;
  currentUserId: string = localStorage.getItem('token');
  currentUser: JUser;
  load: boolean = false;

  constructor(private _projectQuery: ProjectQuery,
    public authQuery: AuthQuery,
    private _modalService: NzModalService,
    private issueTypesService: IssueTypesService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private issuesService: IssuesService) {
      this.nameProject = this.activatedRoute.snapshot.paramMap.get("nameProject");
    }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.assignees = [];
    let getInfoIssue = this.issuesService.getInfoIssue(this.issue.id).toPromise().then(
      (data) => {
        this.issue = data[0];
        this.deadline = data[0].deadlineAt;
        this.deadlineAt = new Date(this.deadline);
        this.month = this.deadlineAt.getMonth() + 1;
      }
    )
    await Promise.all([getInfoIssue]);
    this.issue.userIds.split(',').forEach(async users => {
      if (users) {
        let getUsersById = this.usersService.getUsersById(users).toPromise().then(
          (data) => {
            this.assignees.push(data[0])
          }
        )
        await Promise.all([getUsersById]);
      } else {
        this.assignees = [];
      }
    })

    let getUsersById = this.usersService.getUsersById(this.currentUserId).toPromise().then(
      (data) => {
        if (data[0]) {
          this.currentUser = data[0];
        }
      }
    )
    let getProjectsId = this.projectsService.getProjectsId(this.nameProject).toPromise().then(
      (data) => {
        this.projectsId = data[0].id;
      }
    )
    await Promise.all([getUsersById, getProjectsId]);

    this.issueTypeIcon = IssueUtil.getIssueTypeIcon(this.issue.issueTypeId);
    this.priorityIcon = IssueUtil.getIssuePriorityIcon(this.issue.issuePriorityId);
    // this.issuesService.getInfoIssue(this.issue.id).subscribe(
    //   (data) => {
    //     this.deadline = data[0].deadlineAt;
    //     this.deadlineAt = new Date(this.deadline);
    //     this.month = this.deadlineAt.getMonth() + 1;
    //   }
    // )
    this.load = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  async openIssueModal(issueId: string) {
    let issue: JIssue;
    let getInfoIssue = this.issuesService.getInfoIssue(issueId).toPromise().then(
      (data) => {
        issue = data[0];
      }
    )
    await Promise.all([getInfoIssue]);

    if (this.issue.userIds.includes(this.currentUser.id) || this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString())) {
      const modalRef = this._modalService.create({
        nzContent: IssueModalComponent,
        nzWidth: 1040,
        nzClosable: false,
        nzFooter: null,
        nzComponentParams: {
          issue: issue,
          nameProject: this.nameProject
        }
      });
      modalRef.afterClose.subscribe(
        () => {
          this.getData();
        }
      );
    }
  }
}
