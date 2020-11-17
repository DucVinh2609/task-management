import { Injectable } from '@angular/core';
import { JListJobs } from '@trungk18/interface/list-job';
import dummy from 'src/assets/data/project.json';

@Injectable({
  providedIn: 'root'
})
export class ListJobsService {

  constructor() { }

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
}
