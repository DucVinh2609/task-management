import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { JJobs } from '@trungk18/interface/job';
import { JUser } from '@trungk18/interface/user';
import { JobsService } from '@trungk18/project/services/jobs.service';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { ListJobsService } from '@trungk18/project/services/list-jobs.service';
import { UsersService } from '@trungk18/project/services/users.service';

@Component({
  selector: 'issue-jobs',
  templateUrl: './issue-jobs.component.html',
  styleUrls: ['./issue-jobs.component.scss']
})
export class IssueJobsComponent implements OnChanges {
  @Input() job: JJobs;
  titleJobs: string = '';
  checked = false;
  users: JUser[] = [];
  editMode = false;
  date = '2019-08-18T08:38:22.329Z';

  constructor(private jobsService: JobsService,
    private issuesService: IssuesService,
    private listJobsService: ListJobsService,
    private usersService: UsersService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.titleJobs = this.job.name;
    this.checked = this.job.finish;
    console.log(this.job);
    let issueId = this.listJobsService.getIssueIdByListJobsId(this.job.listJobsId);
    if (issueId) {
      let userIds = this.issuesService.getListUsersInIssue(issueId);
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

  addDeadlineToJobs(deadlineAt: Date): void {
    this.job.deadlineAt = deadlineAt.toLocaleString();
    this.jobsService.updateJobs(this.job);
  }

  isUserSelected(user: JUser): boolean {
    if (!this.job.userIds) {
      this.job.userIds = [];
    }
    return this.job.userIds.includes(user.id);
  }

  addUserToJobs(user: JUser) {
    if (!this.job.userIds) {
      this.job.userIds = [];
    }
    this.job.userIds.push(user.id);
    this.jobsService.updateJobs(this.job);
  }

  checkFinish() {
    this.job.finish = this.checked;
    this.jobsService.updateJobs(this.job);
  }
}
