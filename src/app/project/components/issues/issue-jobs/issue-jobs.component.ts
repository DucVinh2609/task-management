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

  constructor(private jobsService: JobsService,
    private issuesService: IssuesService,
    private usersService: UsersService,
    public authQuery: AuthQuery,
    private _modalService: NzModalService) { }

  async ngOnInit() {
    let getUsersById = this.usersService.getUsersById(this.currentUserId).toPromise().then(
      (data) => {
        this.currentUser = data[0];
      }
    )
    await Promise.all([getUsersById])
    this.getData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.getData()
  }

  getData() {
    this.titleJobs = this.job.name;
    this.assignees = [];
    let userIds = this.jobsService.getListUsersInJob(this.job.id);
    if (this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString())) {
      this.isDisabledDeadline = false;
    }
    if (userIds.includes(this.currentUser.id) || this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString())) {
      this.isDisabledButton = false;
    }
    if (userIds) {
      for (let u in userIds ) {
        this.usersService.getUsersById(userIds[u]).subscribe(
          (data) => {
            this.assignees.push(data[0]);
          }
        )
      }
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
      this.jobsService.updateJobs(this.job);
    }
  }

  isUserSelected(user: JUser): boolean {
    let userIdsInJobs = this.jobsService.getListUsersInJob(this.job.id);
    if (!userIdsInJobs) {
      userIdsInJobs = [];
    }
    return userIdsInJobs.includes(user.id);
  }

  addUserToJobs(user: JUser) {
    let userIdsInJobs = this.jobsService.getListUsersInJob(this.job.id);
    if (!userIdsInJobs) {
      userIdsInJobs = [];
    }
    this.jobsService.updateJobs({
      ...this.job,
      userIds: [...userIdsInJobs, user.id]
    });
    this.getData();
  }

  removeUser(userId: string) {
    let userIdsInJobs = this.jobsService.getListUsersInJob(this.job.id);
    let newUserIds = userIdsInJobs.filter((x) => x !== userId);
    this.jobsService.updateJobs({
      ...this.job,
      userIds: newUserIds
    });
    this.getData();
  }

  checkFinish() {
    this.jobsService.updateJobs({
      ...this.job,
      finish: this.checked
    });
    this.getData();
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
