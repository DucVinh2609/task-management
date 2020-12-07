import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { JJobs } from '@trungk18/interface/job';
import { JUser } from '@trungk18/interface/user';
import { JobsService } from '@trungk18/project/services/jobs.service';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { UsersService } from '@trungk18/project/services/users.service';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { IssueDeleteModalComponent } from '../issue-delete-modal/issue-delete-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'issue-jobs',
  templateUrl: './issue-jobs.component.html',
  styleUrls: ['./issue-jobs.component.scss']
})
export class IssueJobsComponent implements OnChanges {
  @Input() job: JJobs;
  @Input() users: JUser[];
  @Input() projectsId: number;
  currentUserId: string = localStorage.getItem('token');
  currentUser: JUser;
  titleJobs: string = '';
  checked = false;
  assignees: JUser[] = [];
  editMode = false;
  date = '2019-08-18T08:38:22.329Z';
  checkAssignees: boolean = false;
  checkDeadline: boolean = false;
  isDisabledButton: boolean = true;
  isDisabledDeadline: boolean = true;
  checkAdmin = false;
  checkUsuer = false;

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
          this.checkAdmin = this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString());
          this.checkUsuer = this.job.userIds.split(',').includes(this.currentUserId);
        }
      }
    )
    await Promise.all([getUsersById])
    this.getData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.getData()
  }

  async getData() {
    this.titleJobs = this.job.name;
    this.assignees = [];
    let userIds = [];
    let getJobsInfo = this.jobsService.getJobsInfo(this.job.id).toPromise().then(
      (data) => {
        console.log(data[0].userIds);
        userIds = data[0].userIds.split(',');
      }
    )
    await Promise.all([getJobsInfo]);
    if (this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString())) {
      this.isDisabledDeadline = false;
    }
    if (userIds.includes(this.currentUser.id) || this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString())) {
      this.isDisabledButton = false;
    }
    if (userIds) {
      // for (let u in userIds ) {
      //   this.usersService.getUsersById(userIds[u]).subscribe(
      //     (data) => {
      //       this.assignees.push(data[0]);
      //     }
      //   )
      // }
    }

    if (this.assignees.length != 0) {
      this.checkAssignees = true;
    }
    if (this.editMode || this.job.deadlineAt) {
      this.checkDeadline = true;
    }
  }

  AddDeadline() {
    this.editMode = true;
  }

  addDeadlineToJobs(deadlineAt: Date): void {
    if (deadlineAt) {
      this.job.deadlineAt = deadlineAt.toLocaleString();
      this.jobsService.updateJobs(this.job).subscribe(
        () => {
          this.getData();
        }
      )
    }
  }

  async isUserSelected(user: JUser) {
    let userIdsInJobs = '';
    let getJobsInfo = this.jobsService.getJobsInfo(this.job.id).toPromise().then(
      (data) => {
        userIdsInJobs = data[0].userIds;
      }
    )
    await Promise.all([getJobsInfo]);
    if (!userIdsInJobs) {
      userIdsInJobs = '';
    }
    return userIdsInJobs.includes(user.id);
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
        this.getData();
      }
    )
  }

  openDatePicker() {
    if(this.isDisabledDeadline) {
      this.editMode = false;
    } else this.editMode = true;
  }

  deleteJobs() {
    this._modalService.create({
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
  }
}
