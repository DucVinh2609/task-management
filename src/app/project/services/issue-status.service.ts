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
}
