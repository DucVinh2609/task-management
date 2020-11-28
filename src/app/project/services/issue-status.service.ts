import { Injectable } from '@angular/core';
import { JIssueStatus } from '@trungk18/interface/issue';
import dummy from 'src/assets/data/project.json';

@Injectable({
  providedIn: 'root'
})
export class IssueStatusService {
  status: JIssueStatus;

  constructor() { }

  getStatusName(statusId: number) {
    this.status = dummy.status.filter(u => u.id == statusId)[0];
    if (this.status) {
      return this.status.status
    }
  }

  getStatusByProjectId(projectId: number) {
    return dummy.status.filter(s => s.projectId == projectId);
  }

  createIssueStatus(status: string, projectId: number) {
    let statusId = dummy.status.sort((a, b) => (a.id < b.id) ? 1 : -1)[0].id + 1;
    let position = dummy.status.filter(s => s.projectId == projectId).length;
    let newIssueStatus: JIssueStatus = {
      "id": statusId,
      "position": position,
      "status": status,
      "projectId": projectId
    }
    dummy.status.push(newIssueStatus);
  }

  getProjectIdByStatusId(statusId: number) {
    this.status = dummy.status.filter(u => u.id == statusId)[0];
    if (this.status) {
      return this.status.projectId
    }
  }

  updateIssueStatus(status: JIssueStatus) {
    let issueStatus = dummy.status.filter(j => j.id == status.id)[0];
    if(issueStatus) {
      issueStatus.id = status.id;
      issueStatus.position = status.position;
      issueStatus.projectId = status.projectId;
      issueStatus.status = status.status;
    }
  }
}
