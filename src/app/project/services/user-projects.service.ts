import { Injectable } from '@angular/core';
import dummy from 'src/assets/data/project.json';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UsersService } from '@trungk18/project/services/users.service';
import { JUserProjects } from '@trungk18/interface/user';

@Injectable({
  providedIn: 'root'
})
export class UserProjectsService {

  constructor(private usersService: UsersService,
    private http: HttpClient) { }

  getProjectOfUsers(userId: string) {
    return this.http.get(environment.apiUrl + 'api/v1/user-project/info/' + userId);
  }

  postProjectOfUsers(newUserProjects: JUserProjects) {
    const body = newUserProjects;
    return this.http.post(environment.apiUrl + 'api/v1/user-project/', body);
  }

  removeMemberInProject({userId, projectId}) {
    return this.http.delete(environment.apiUrl + 'api/v1/user-project/' + userId + '/' + projectId);
  }
}
