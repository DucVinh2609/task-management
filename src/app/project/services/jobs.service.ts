import { Injectable } from '@angular/core';
import { JJobs } from '@trungk18/interface/job';
import dummy from 'src/assets/data/project.json';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  jobs: JJobs;

  constructor(private http: HttpClient) { }

  // getLastIdJobInListJobs() {
  //   if (dummy.jobs) {
  //     this.jobs = dummy.jobs.sort((a, b) => (a.id > b.id) ? 1 : -1)[dummy.jobs.length - 1];
  //     if (this.jobs) {
  //       return this.jobs.id
  //     }
  //   } else return null
  // }

  getJobsInWorkList(listJobsId: number) {
    return this.http.get(environment.apiUrl + 'api/v1/job/list-job/' + listJobsId);
  }

  getJobsInWorkListFinish(listJobsId: number) {
    return this.http.get(environment.apiUrl + 'api/v1/job/finish/' + listJobsId);
  }

  addJobs(jobs) {
    return this.http.post(environment.apiUrl + 'api/v1/job/', jobs);
  }

  getJobsInfo(jobId: number) {
    return this.http.get(environment.apiUrl + 'api/v1/job/' + jobId);
  }

  // getListUsersInJob(jobId: number) {
  //   return dummy.jobs.filter(j => j.id == jobId)[0].userIds;
  // }

  updateJobs(jobs: JJobs) {
    let body = {
      name: jobs.name,
      finish: jobs.finish,
      deadlineAt: jobs.deadlineAt,
      listJobId: jobs.listJobId,
      userIds: jobs.userIds,
      description: jobs.description
    }
    return this.http.put(environment.apiUrl + 'api/v1/job/' + jobs.id, body);
  }

  deleteJobs(jobId: number) {
    return this.http.delete(environment.apiUrl + 'api/v1/job/' + jobId);
  }

  getListJobIsDeadlineOfUser(userId: string) {
    return dummy.jobs.filter(u => u.userIds.includes(userId));
  }
}
