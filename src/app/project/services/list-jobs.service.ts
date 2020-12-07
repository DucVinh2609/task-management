import { Injectable } from '@angular/core';
import { JJobs } from '@trungk18/interface/job';
import { JListJobs } from '@trungk18/interface/list-job';
import dummy from 'src/assets/data/project.json';
import { JobsService } from '@trungk18/project/services/jobs.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListJobsService {
  jobs: JJobs[] = [];
  constructor(private jobsService: JobsService,
    private http: HttpClient) { }

  getWorkListsInIssue(issueId) {
    return this.http.get(environment.apiUrl + 'api/v1/list-job/issue/' + issueId).pipe(map(
      listJob => {
        return listJob;
      }
    ));
  }

  getAllId() {
    return this.http.get(environment.apiUrl + 'api/v1/list-job/id');
  }

  addListJobs(body: JListJobs) {
    return this.http.post(environment.apiUrl + 'api/v1/list-job/', body);
  }

  getIssueIdByListJobsId(listJobSId: number) {
    return this.http.get(environment.apiUrl + 'api/v1/list-job/' + listJobSId);
  }

  deleteListJobs(listJobsId: number) {
    // this.jobs = this.jobsService.getJobsInWorkList(listJobsId);
    // this.jobs.forEach(j => {
    //   this.jobsService.deleteJobs(j.id);
    // });
    // const index = dummy.listJobs.findIndex(x => x.id === listJobsId);
    // if (index !== undefined) dummy.listJobs.splice(index, 1);
  }
}
