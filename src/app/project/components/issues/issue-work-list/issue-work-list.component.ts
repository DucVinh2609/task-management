import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { JListJobs } from '@trungk18/interface/list-job';
import { JJobs } from '@trungk18/interface/job';
import { JobsService } from '@trungk18/project/services/jobs.service';
import { JUser } from '@trungk18/interface/user';
import { AuthQuery } from '@trungk18/project/auth/auth.query';

@Component({
  selector: 'issue-work-list',
  templateUrl: './issue-work-list.component.html',
  styleUrls: ['./issue-work-list.component.scss']
})
@UntilDestroy()
export class IssueWorkListComponent implements OnChanges {
  @Input() workList: JListJobs;
  @Input() users: JUser[];
  @Input() projectsId: number;
  title: string = '';
  listJobsId: number;
  issueId: string = '';
  checkAddJob: boolean = false;
  titleJobs: string = '';
  percent = 0;
  jobs: JJobs[] = [];

  constructor(private jobsService: JobsService,
    public authQuery: AuthQuery) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.title = this.workList.name;
    this.listJobsId = this.workList.id;
    this.issueId = this.workList.issueId;
  }

  ngAfterContentChecked() {
    if (this.listJobsId) {
      this.jobs = this.jobsService.getJobsInWorkList(this.listJobsId);
      this.percent = this.jobsService.getPercentOfWorkList(this.listJobsId);
    }
  }

  addJob() {
    this.checkAddJob = true;
  }

  addJobs() {
    if (this.titleJobs.trim()) {
      let job: JJobs = {
        id: this.randomIdJob(),
        name: this.titleJobs.trim(),
        issueId: this.issueId,
        finish: false,
        userIds: null,
        deadlineAt: null,
        listJobsId: this.listJobsId,
        description: null
      };

      this.jobsService.addJobs(job);
      this.checkAddJob = false;
      this.titleJobs = '';
    }
  }

  randomIdJob() {
    let lastId = this.jobsService.getLastIdJobInListJobs()
    if(lastId) {
      return lastId + 1;
    } else {
      return +(this.listJobsId + "0001");
    }
  }

  cancelAddJob() {
    this.checkAddJob = false;
    this.titleJobs = '';
  }
}
