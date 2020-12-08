import { Injectable } from '@angular/core';
import dummy from 'src/assets/data/project.json';
import { JIssuePriorities } from 'src/app/interface/issue';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IssuePrioritiesService {
  priorities: JIssuePriorities;
  constructor(private http: HttpClient) { }

  getIssuePriorities(id: number) {
    return this.http.get(environment.apiUrl + 'api/v1/issue-priority/' + id);
  }

  getAllIssuePriorities() {
    return this.http.get(environment.apiUrl + 'api/v1/issue-priority/');
  }
}
