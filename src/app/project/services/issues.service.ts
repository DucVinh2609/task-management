import { Injectable } from '@angular/core';
import { JIssue } from '@trungk18/interface/issue';
import dummy from 'src/assets/data/project.json';
import { DateUtil } from '@trungk18/project/utils/date';
import { IssueUtil } from '@trungk18/project/utils/issue';
import { IssueStatusService } from '@trungk18/project/services/issue-status.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  issues: JIssue;

  constructor(private issueStatusService: IssueStatusService,
    private http: HttpClient) { }

  getAllIssueInStatus (statusId: number) {
    return this.http.get(environment.apiUrl + 'api/v1/issue/status/' + statusId);
  }

  getIssuesOfUserInStatus (issues: JIssue[], userIds: any, statusId: number) {
    let listIssues: JIssue[] = [];
    let listIssuesMerge: JIssue[] = [];
    userIds.forEach(user => {
      listIssuesMerge = [
        ...listIssues,
        ...issues.filter(j => j.userIds.includes(user) && j.issueStatusId == statusId).sort((a, b) => (a.listPosition > b.listPosition) ? 1 : -1)
      ];
      listIssuesMerge = listIssuesMerge.filter((item, index) => listIssuesMerge.indexOf(item) === index).sort((a, b) => (a.listPosition > b.listPosition) ? 1 : -1);
      listIssues = listIssuesMerge;
    });
    return listIssuesMerge;
  }

  searchIssuesInStatus (issues: JIssue[], searchTerm: string, statusId: number) {
    let listIssues: JIssue[] = [];
    issues.forEach(issue => {
      if (IssueUtil.searchString(issue.title, searchTerm) && issue.issueStatusId === statusId) {
        listIssues.push(issue);
      }
    });
    return listIssues;
  }

  getIssuesOfCurrentUserInStatus (issues: JIssue[], currentUserId: string, statusId: number) {
    let listIssues: JIssue[] = [];
    issues.forEach(issue => {
      if (currentUserId && issue.userIds.includes(currentUserId) && issue.issueStatusId === statusId) {
        listIssues.push(issue);
      }
    });
    return listIssues;
  }

  getIssuesDoneInStatus (issues: JIssue[], lastStatus: number) {
    let listIssues: JIssue[] = [];
    issues.forEach(issue => {
      if (issue.issueStatusId !== lastStatus) {
        listIssues.push(issue);
      }
    });
    return listIssues;
  }

  addIssue(issue: JIssue) {
    return this.http.post(environment.apiUrl + 'api/v1/issue/', issue);
  }

  getInfoIssue(issueId: string) {
    return this.http.get(environment.apiUrl + 'api/v1/issue/' + issueId);
  }

  updateIssue(issue: JIssue) {
    let updatedAt = DateUtil.getNow();
    let body = {
      id: issue.id,
      updatedAt: updatedAt,
      issueStatusId: issue.issueStatusId,
      title: issue.title,
      listPosition: issue.listPosition,
      reporterId: issue.reporterId,
      createdAt: issue.createdAt,
      issueTypeId: issue.issueTypeId,
      deadlineAt: issue.deadlineAt,
      userIds: issue.userIds,
      issuePriorityId: issue.issuePriorityId,
      description: issue.description
    }
    return this.http.put(environment.apiUrl + 'api/v1/issue/' + issue.id, body);
  }

  deleteIssue(issueId: string) {
    return this.http.delete(environment.apiUrl + 'api/v1/issue/' + issueId);
  }

  getListIssuesByUserId(userId: string) {
    return this.http.get(environment.apiUrl + 'api/v1/issue/user/' + userId);
  }
}
