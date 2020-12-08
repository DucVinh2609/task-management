import { Injectable } from '@angular/core';
import { JProjects } from '@trungk18/interface/project';
import { IssueStatusDisplay } from '@trungk18/interface/issue';
import { IssueStatusService } from '@trungk18/project/services/issue-status.service';
import dummy from 'src/assets/data/project.json';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private issueStatusService: IssueStatusService,
    private http: HttpClient) { }

  getProjectsId(projectsName: string) {
    return this.http.get(environment.apiUrl + 'api/v1/project/name/' + projectsName).pipe(map(
      projectId => {
        return projectId;
      }
    ));
  }

  getProjectsInfo(projectId: string) {
    return this.http.get(environment.apiUrl + 'api/v1/project/' + projectId);
    // return dummy.projects.filter(u => u.id == projectId)[0];
  }

  getAllIdOfProjects() {
    return this.http.get(environment.apiUrl + 'api/v1/project/');
  }

  createProject(newProjects: JProjects) {
    return this.http.post(environment.apiUrl + 'api/v1/project/', newProjects);
  }

}
