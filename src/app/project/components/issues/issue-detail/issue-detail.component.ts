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

@Component({
  selector: 'issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
export class IssueDetailComponent implements OnInit {
  @Input() issue: JIssue;
  @Input() isShowFullScreenButton: boolean;
  @Input() isShowCloseButton: boolean;
  @Output() onClosed = new EventEmitter();
  @Output() onOpenIssue = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<DeleteIssueModel>();
  workLists: JListJobs[] = [];
  users: JUser[] = [];

  constructor(public projectQuery: ProjectQuery,
    private _modalService: NzModalService,
    private listJobsService: ListJobsService,
    private issuesService: IssuesService,
    private usersService: UsersService) {}

  ngOnInit(): void {}

  ngAfterContentChecked() {
    if (this.issue) {
      this.workLists = this.listJobsService.getWorkListsInIssue(this.issue.id);
      let userIds = this.issuesService.getListUsersInIssue(this.issue.id);
      this.users = [];
      if (userIds) {
        for (let u in userIds ) {
          let user = this.usersService.getUsersById(userIds[u]);
          if (user) {
            this.users.push(user);
          }
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
        issueId: this.issue.id,
        onDelete: this.onDelete                
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
