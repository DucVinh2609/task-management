import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { JJobs } from '@trungk18/interface/job';
import { JobsService } from '@trungk18/project/services/jobs.service';

@Component({
  selector: 'issue-jobs',
  templateUrl: './issue-jobs.component.html',
  styleUrls: ['./issue-jobs.component.scss']
})
export class IssueJobsComponent implements OnChanges {
  @Input() job: JJobs;
  titleJobs: string = '';
  checked = false;
  constructor(private jobsService: JobsService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.titleJobs = this.job.name;
    this.checked = this.job.finish;
    console.log(this.job);
  }

  checkFinish() {
    this.job.finish = this.checked;
    this.jobsService.updateJobs(this.job);
  }
}
