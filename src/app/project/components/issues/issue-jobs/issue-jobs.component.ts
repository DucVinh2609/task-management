import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { JJobs } from '@trungk18/interface/job';
import { JUser } from '@trungk18/interface/user';
import { JobsService } from '@trungk18/project/services/jobs.service';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { UsersService } from '@trungk18/project/services/users.service';

@Component({
  selector: 'issue-jobs',
  templateUrl: './issue-jobs.component.html',
  styleUrls: ['./issue-jobs.component.scss']
})
export class IssueJobsComponent implements OnChanges {
  @Input() job: JJobs;
  @Input() users: JUser[];
  titleJobs: string = '';
  checked = false;
  assignees: JUser[] = [];
  editMode = false;
  date = '2019-08-18T08:38:22.329Z';
  checkAssignees: boolean = false;
  checkDeadline: boolean = false;

  constructor(private jobsService: JobsService,
    private issuesService: IssuesService,
    private usersService: UsersService) { }

  ngOnInit(): void {
    this.getData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getData()
  }

  getData() {
    this.titleJobs = this.job.name;

    this.assignees = [];
    let userIds = this.jobsService.getListUsersInJob(this.job.id);
    if (userIds) {
      for (let u in userIds ) {
        let user = this.usersService.getUsersById(userIds[u]);
        if (user) {
          this.assignees.push(user);
        }
      }
    }

    if (this.assignees.length != 0) {
      this.checkAssignees = true;
    }
    if (this.editMode) {
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
}
