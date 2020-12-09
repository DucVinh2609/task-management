import { Injectable } from '@angular/core';
import { JIssueStatus } from '@trungk18/interface/issue';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import dummy from 'src/assets/data/project.json';

@Injectable({
  providedIn: 'root'
})
export class IssueStatusService {
  status: JIssueStatus;

  constructor(private http: HttpClient) { }

  getStatusName(statusId: number) {
    // let params = new HttpParams();
    // params = params.append('userId', userId);
    let getStatusName = this.http.get(environment.apiUrl + 'api/v1/issue-status/' + statusId);
    // let getUsersById = this.http.get(environment.apiUrl + 'api/v1/user/' + userId, { params: params });
    getStatusName.subscribe(data => {
    });
    this.status = dummy.status.filter(u => u.id == statusId)[0];
    if (this.status) {
      return this.status.status
    }
  }

  getStatusByProjectId(projectId: number) {
    return this.http.get(environment.apiUrl + 'api/v1/issue-status/project/' + projectId);
  }

  createIssueStatus(status: string, projectId: number, position: number) {
    let newIssueStatus = {
      "position": position,
      "status": status,
      "projectId": projectId
    }
    return this.http.post(environment.apiUrl + 'api/v1/issue-status/', newIssueStatus);
  }

  getProjectIdByStatusId(statusId: number) {
    return this.http.get(environment.apiUrl + 'api/v1/issue-status/' + statusId);
  }

  updateIssueStatus(status: JIssueStatus) {
    let body = {
      position: status.position,
      projectId: status.projectId,
      status: status.status
    }
    return this.http.put(environment.apiUrl + 'api/v1/issue-status/' + status.id, body);
  }
}
