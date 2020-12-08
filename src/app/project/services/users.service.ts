import { Injectable } from '@angular/core';
import { JUser, JUserProjects } from 'src/app/interface/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import dummy from 'src/assets/data/project.json';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  listUserProjects: JUserProjects[] = [];
  listUsers: JUser[] = [];
  users: JUser;
  constructor(private http: HttpClient) { }

  getUsersById(userId: string) {
    console.log(userId);
    return this.http.get(environment.apiUrl + 'api/v1/user/' + userId);
  }

  updateAdminProjects(user: JUser, projectId: string) {
    let projectAdmin = '';
    if (!user.projectAdmin) {
      projectAdmin = projectId;
    } else {
      projectAdmin = user.projectAdmin + ',' + projectId;
    }

    const body = {
      projectAdmins: projectAdmin
    }
    return this.http.put(environment.apiUrl + 'api/v1/user/update_admin_projects/' + user.id, body);
  }

  getUsersInProjects(projectId: number) {
    return this.http.get(environment.apiUrl + 'api/v1/user-project/' + projectId);
  }

  getIdUserByEmail(email: string) {
    return this.http.get(environment.apiUrl + 'api/v1/user/email/' + email);
  }

  registerNewUser(user: JUser) {
    const body = user;
    // dummy.users.push(user);
    // console.log(dummy.users);
    return this.http.post(environment.apiUrl + 'api/v1/user/', body);
  }
}
