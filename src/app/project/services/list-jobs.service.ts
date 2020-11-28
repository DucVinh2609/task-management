import { Injectable } from '@angular/core';
import { JJobs } from '@trungk18/interface/job';
import { JListJobs } from '@trungk18/interface/list-job';
import dummy from 'src/assets/data/project.json';
import { JobsService } from '@trungk18/project/services/jobs.service';

@Injectable({
  providedIn: 'root'
})
export class ListJobsService {
  jobs: JJobs[] = [];
  constructor(private jobsService: JobsService) { }

  getWorkListsInIssue(issueId) {
    return dummy.listJobs.filter(l => l.issueId == issueId);
  }

  addListJobs(name, issueId) {
    let listJobs: JListJobs = {
      "id": dummy.listJobs.sort((a, b) => (a.id > b.id) ? 1 : -1)[dummy.listJobs.length - 1].id + 1,
      "name": name,
      "issueId": issueId
    }
    dummy.listJobs.push(listJobs)
  }

  getIssueIdByListJobsId(listJobSId: number) {
    return dummy.listJobs.filter(j => j.id == listJobSId)[0].issueId;
  }

  deleteListJobs(listJobsId: number) {
    this.jobs = this.jobsService.getJobsInWorkList(listJobsId);
    this.jobs.forEach(j => {
      this.jobsService.deleteJobs(j.id);
    });
    const index = dummy.listJobs.findIndex(x => x.id === listJobsId);
    if (index !== undefined) dummy.listJobs.splice(index, 1);
  }
}
