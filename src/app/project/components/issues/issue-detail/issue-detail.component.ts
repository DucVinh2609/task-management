import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JIssue } from '@trungk18/interface/issue';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { NzModalService } from 'ng-zorro-antd/modal';
import { IssueDeleteModalComponent } from '../issue-delete-modal/issue-delete-modal.component';
import { IssueAddWorkListModalComponent } from '../issue-add-work-list-modal/issue-add-work-list-modal.component';
import { DeleteIssueModel } from '@trungk18/interface/ui-model/delete-issue-model';
import { JListJobs } from '@trungk18/interface/list-job';
import { ListJobsService } from '@trungk18/project/services/list-jobs.service';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { UsersService } from '@trungk18/project/services/users.service';
import { JUser } from '@trungk18/interface/user';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectsService } from '@trungk18/project/services/projects.service';

@Component({
  selector: 'issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
export class IssueDetailComponent implements OnInit {
  @Input() issue: JIssue;
  @Input() projectsId: number;
  @Input() isShowFullScreenButton: boolean;
  @Input() isShowCloseButton: boolean;
  @Output() onClosed = new EventEmitter();
  @Output() onOpenIssue = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<DeleteIssueModel>();
  currentUserId: string = localStorage.getItem('token');
  currentUser: JUser;
  workLists: JListJobs[] = [];
  users: JUser[] = [];
  nameProject: string = '';
  checkAdmin = false;

  constructor(public projectQuery: ProjectQuery,
    private _modalService: NzModalService,
    private listJobsService: ListJobsService,
    private issuesService: IssuesService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    public authQuery: AuthQuery) {
    }

  async ngOnInit() {
    console.log(this.projectsId);
    this.usersService.getUsersById(this.currentUserId).subscribe(
      (data) => {
        if (data[0]) {
          this.currentUser = data[0];
          this.checkAdmin = this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString());
        }
      }
    )

    if (this.issue) {
      // this.issue = this.issuesService.getInfoIssue(this.issue.id);
      this.listJobsService.getWorkListsInIssue(this.issue.id).subscribe(
        (data: any) => {
          console.log(data);
          this.workLists = data;
        }
      )
      let userIds = this.issue.userIds;
      this.users = [];
      if (userIds) {
        for (let i = 0; i < userIds.length; i++) {
          let getUsersById = this.usersService.getUsersById(userIds[i]).toPromise().then(
            (data) => {
              this.users.push(data[0]);
            }
          )
          await Promise.all([getUsersById]);
        }
      }
    }
  }

  openAddWorkListModal() {
    this._modalService.create({
      nzContent: IssueAddWorkListModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzStyle: {
        top: "140px"
      },
      nzComponentParams: {
        issueId: this.issue.id,
      }
    });
  }

  openDeleteIssueModal() {
    this._modalService.create({
      nzContent: IssueDeleteModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzStyle: {
        top: "140px"
      },
      nzComponentParams: {
        title: "Are you sure you want to delete this issue?",
        data: this.issue.id,
        onDelete: this.onDelete,
        delete: "issue"
      }      
    });
  }

  closeModal() {
    this.onClosed.emit();
  }

  openIssuePage() {
    this.onOpenIssue.emit(this.issue.id);
  }
}
