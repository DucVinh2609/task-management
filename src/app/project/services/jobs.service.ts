import { Injectable } from '@angular/core';
import { JJobs } from '@trungk18/interface/job';
import dummy from 'src/assets/data/project.json';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  jobs: JJobs;

  constructor() { }

  getLastIdJobInListJobs() {
    if (dummy.jobs) {
      this.jobs = dummy.jobs.sort((a, b) => (a.id > b.id) ? 1 : -1)[dummy.jobs.length - 1];
      if (this.jobs) {
        return this.jobs.id
      }
    } else return null
  }

  getJobsInWorkList(listJobsId: number) {
    return dummy.jobs.filter(j => j.listJobsId == listJobsId);
  }

  addJobs(jobs: JJobs) {
    dummy.jobs.push(jobs)
  }

  getPercentOfWorkList(listJobsId: number) {
    let countJobs = dummy.jobs.filter(j => j.listJobsId == listJobsId).length;
    if (countJobs == 0) {
      return 0;
    } else {
      let countJobsFinish =  dummy.jobs.filter(j => j.listJobsId == listJobsId && j.finish == true).length;
      return Math.round((countJobsFinish/countJobs) * 100);
    }
  }

  getJobsInfo(jobId: number) {
    return dummy.jobs.filter(j => j.id == jobId)[0];
  }

  getListUsersInJob(jobId: number) {
    return dummy.jobs.filter(j => j.id == jobId)[0].userIds;
  }

  updateJobs(jobs: JJobs) {
    let job = dummy.jobs.filter(j => j.id == jobs.id)[0];
    if(job) {
      job.name = jobs.name;
      job.userIds = jobs.userIds;
      job.finish = jobs.finish;
      job.deadlineAt = jobs.deadlineAt;
      job.userIds = jobs.userIds;
      job.description = jobs.description;
    }
  }

  deleteJobs(jobId: number) {
    const index = dummy.jobs.findIndex(x => x.id === jobId);
    if (index !== undefined) dummy.jobs.splice(index, 1);
  }

  getListJobIsDeadlineOfUser(userId: string) {
    return dummy.jobs.filter(u => u.userIds.includes(userId));
  }
}
