import { Injectable } from '@angular/core';
import { JIssue } from '@trungk18/interface/issue';
import dummy from 'src/assets/data/project.json';
import { DateUtil } from '@trungk18/project/utils/date';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  issues: JIssue;

  constructor() { }

  getAllIssueInStatus (statusId: number) {
    return dummy.issues.filter(j => j.issueStatusId == statusId);
  }

  addIssue(issue: JIssue) {
    dummy.issues.push(issue)
  }

  getListUsersInIssue(issueId: string) {
    return dummy.issues.filter(j => j.id == issueId)[0].userIds;
  }

  updateIssue(issue: JIssue) {
    let issueUpdate = dummy.issues.filter(i => i.id == issue.id)[0];
    let updatedAt = DateUtil.getNow();
    if(issueUpdate) {
      issueUpdate.updatedAt = updatedAt;
      issueUpdate.issueStatusId = issue.issueStatusId;
      issueUpdate.title = issue.title;
      issueUpdate.deadlineAt = issue.updatedAt;
    }
    console.log(issueUpdate);
  }
}
