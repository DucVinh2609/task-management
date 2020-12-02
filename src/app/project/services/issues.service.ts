import { Injectable } from '@angular/core';
import { JIssue } from '@trungk18/interface/issue';
import dummy from 'src/assets/data/project.json';
import { DateUtil } from '@trungk18/project/utils/date';
import { IssueUtil } from '@trungk18/project/utils/issue';
import { IssueStatusService } from '@trungk18/project/services/issue-status.service';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  issues: JIssue;

  constructor(private issueStatusService: IssueStatusService) { }

  getAllIssueInStatus (statusId: number) {
    return dummy.issues.filter(j => j.issueStatusId == statusId).sort((a, b) => (a.listPosition > b.listPosition) ? 1 : -1);
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

  getIssuesDoneInStatus (issues: JIssue[], projectId: number, statusId: number) {
    let listIssues: JIssue[] = [];
    let statusIdLastOfProject = this.issueStatusService.getStatusByProjectId(projectId).sort((a, b) => (a.position < b.position) ? 1 : -1)[0].id;
    issues.forEach(issue => {
      if (issue.issueStatusId !== statusIdLastOfProject) {
        listIssues.push(issue);
      }
    });
    return listIssues;
  }

  addIssue(issue: JIssue) {
    dummy.issues.push(issue)
  }

  getListUsersInIssue(issueId: string) {
    return dummy.issues.filter(j => j.id == issueId)[0].userIds;
  }

  getInfoIssue(issueId: string) {
    return dummy.issues.filter(j => j.id == issueId)[0];
  }

  updateIssue(issue: JIssue) {
    let issueUpdate = dummy.issues.filter(i => i.id == issue.id)[0];
    let updatedAt = DateUtil.getNow();
    if(issueUpdate) {
      issueUpdate.updatedAt = updatedAt;
      issueUpdate.issueStatusId = issue.issueStatusId;
      issueUpdate.title = issue.title;
      issueUpdate.deadlineAt = issue.deadlineAt;
      issueUpdate.userIds = issue.userIds;
      issueUpdate.issuePriorityId = issue.issuePriorityId;
      issueUpdate.description = issue.description;
    }
    console.log(issueUpdate);
  }

  deleteIssue(issueId: string) {
    const index = dummy.issues.findIndex(x => x.id === issueId);
    if (index !== undefined) dummy.issues.splice(index, 1);
  }

  getListIssuesOfJob(issueId: any[]) {
    return dummy.issues.filter(u => issueId.includes(u.id));
  }
}
