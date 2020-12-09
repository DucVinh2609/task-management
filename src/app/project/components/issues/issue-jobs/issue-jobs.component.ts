import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { JJobs } from '@trungk18/interface/job';
import { JUser } from '@trungk18/interface/user';
import { JobsService } from '@trungk18/project/services/jobs.service';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { UsersService } from '@trungk18/project/services/users.service';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { IssueDeleteModalComponent } from '../issue-delete-modal/issue-delete-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import moment from 'moment';

@Component({
  selector: 'issue-jobs',
  templateUrl: './issue-jobs.component.html',
  styleUrls: ['./issue-jobs.component.scss']
})
export class IssueJobsComponent implements OnInit {
  @Input() job: JJobs;
  @Input() issueId: string;
  @Input() projectsId: number;
  @Output() onDelete = new EventEmitter<boolean>();
  @Output() onCheckFinish = new EventEmitter<boolean>();
  users: JUser[] = [];
  currentUserId: string = localStorage.getItem('token');
  currentUser: JUser;
  titleJobs: string = '';
  checked = false;
  assignees: JUser[] = [];
  editMode = false;
  date: Date | null = null;
  checkAssignees: boolean = false;
  isDisabledButton: boolean = true;
  isDisabledDeadline: boolean = true;
  checkAdmin = false;
  checkUsuer = false;
  userIds = [];

  constructor(private jobsService: JobsService,
    private issuesService: IssuesService,
    private usersService: UsersService,
    public authQuery: AuthQuery,
    private _modalService: NzModalService) { }

  async ngOnInit() {
    let getUsersById = this.usersService.getUsersById(this.currentUserId).toPromise().then(
      (data) => {
        if (data[0]) {
          this.currentUser = data[0];
          if (this.currentUser.projectAdmin) {
            this.checkAdmin = this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString());
          }
          this.checkUsuer = this.job.userIds.split(',').includes(this.currentUserId);
        }
      }
    )
    await Promise.all([getUsersById])
    this.getData()
  }

  async getData() {
    if (this.job.deadlineAt) {
      this.date = new Date(this.job.deadlineAt);
    } else {
      this.date = new Date();
    }

    if (this.job.finish) {
      this.checked = true;
    } else {
      this.checked = false;
    }
    this.titleJobs = this.job.name;
    this.assignees = [];
    this.users = [];
    this.userIds = [];
    let userIdsOfIssue = '';

    let getInfoIssue = this.issuesService.getInfoIssue(this.issueId).toPromise().then(
      (data) => {
        userIdsOfIssue = data[0].userIds;
      }
    )
    await Promise.all([getInfoIssue]);

    if (userIdsOfIssue.split(',').length > 0) {
      for (let i = 0; i < userIdsOfIssue.split(',').length; i++) {
        if (userIdsOfIssue.split(',')[i]) {
          let getUsersById = this.usersService.getUsersById(userIdsOfIssue.split(',')[i]).toPromise().then(
            (data) => {
              this.users.push(data[0]);
            }
          )
          await Promise.all([getUsersById]);
        } else {
          this.users = [];
        }
      }
    }

    let getJobsInfo = this.jobsService.getJobsInfo(this.job.id).toPromise().then(
      (data) => {
        this.userIds = data[0].userIds.split(',');
      }
    )
    await Promise.all([getJobsInfo]);
    if (this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString())) {
      this.isDisabledDeadline = false;
    }
    if (this.userIds.includes(this.currentUser.id) || this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString())) {
      this.isDisabledButton = false;
    }
    if (this.userIds.length > 0) {
      for (let i = 0; i < this.userIds.length; i++) {
        if (this.userIds[i]) {
          let getUsersById = this.usersService.getUsersById(this.userIds[i]).toPromise().then(
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

    if (this.assignees.length != 0) {
      this.checkAssignees = true;
    }
  }

  AddDeadline() {
    this.editMode = true;
  }

  addDeadlineToJobs(deadlineAt: Date): void {
    if (deadlineAt) {
      this.job.deadlineAt = moment(deadlineAt).format("YYYY-MM-DD HH:mm:ss");
      this.jobsService.updateJobs(this.job).subscribe(
        () => {
          this.getData();
        }
      )
    }
  }

  isUserSelected(user: JUser) {
    return this.userIds.includes(user.id);
  }

  async addUserToJobs(user: JUser) {
    let userIdsInJobs = '';
    let getJobsInfo = this.jobsService.getJobsInfo(this.job.id).toPromise().then(
      (data) => {
        userIdsInJobs = data[0].userIds;
      }
    )
    await Promise.all([getJobsInfo]);
    let newUserIds = '';
    if (!userIdsInJobs) {
      userIdsInJobs = '';
      newUserIds = user.id;
    } else {
      newUserIds = userIdsInJobs + ',' + user.id;
    }

    this.jobsService.updateJobs({
      ...this.job,
      userIds: newUserIds
    }).subscribe(
      () => {
        this.getData();
      }
    )
  }

  async removeUser(userId: string) {
    let userIdsInJobs = [];
    let getJobsInfo = this.jobsService.getJobsInfo(this.job.id).toPromise().then(
      (data) => {
        userIdsInJobs = data[0].userIds.split(',');
      }
    )
    await Promise.all([getJobsInfo]);

    let newUserId = userIdsInJobs.filter((x) => x !== userId);
    let newUserIds = '';
    for (let i = 0; i < newUserId.length; i++) {
      if (i !== newUserId.length - 1) {
        newUserIds = newUserIds + newUserId[i] + ',';
      } else {
        newUserIds = newUserIds + newUserId[i];
      }
    }
    this.jobsService.updateJobs({
      ...this.job,
      userIds: newUserIds
    }).subscribe(
      () => {
        this.getData();
      }
    )
  }

  checkFinish() {
    this.jobsService.updateJobs({
      ...this.job,
      finish: this.checked
    }).subscribe(
      () => {
        this.onCheckFinish.emit(true);
      }
    )
  }

  openDatePicker() {
    if(this.isDisabledDeadline) {
      this.editMode = false;
    } else this.editMode = true;
  }

  deleteJobs() {
    const modalRef = this._modalService.create({
      nzContent: IssueDeleteModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzStyle: {
        top: "140px"
      },
      nzComponentParams: {
        title: "Are you sure you want to delete this jobs?",
        data: this.job.id,
        onDelete: null,
        delete: "jobs"
      }      
    });
    modalRef.afterClose.subscribe(
      () => {
        this.onDelete.emit(true);
      }
    );
  }
}
