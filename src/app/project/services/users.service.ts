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
  users: any;
  constructor(private http: HttpClient) { }

  getUsersById(userId: string) {
    // let params = new HttpParams();
    // params = params.append('userId', userId);
    // let getUsersById = this.http.get(environment.apiUrl + 'api/v1/user/' + userId);
    // let getUsersById = this.http.get(environment.apiUrl + 'api/v1/user/' + userId, { params: params });
    // getUsersById.subscribe(data => {
    //   this.users = data;
    // });
    this.users = dummy.users.filter(u => u.id == userId)[0];
    if (this.users) {
      return this.users
    }
  }

  updateAdminProjects(userId: string, projectId: number) {
    let user = dummy.users.filter(u => u.id == userId)[0];
    if(user) {
      user.projectAdmin.push(projectId);
    }
  }

  getUsersInProjects(projectId: number) {
    this.listUsers = [];
    this.listUserProjects = dummy.userProjects.filter(u => u.projectId == projectId);
    this.listUserProjects.forEach(users => {
      this.listUsers.push(dummy.users.filter(u => u.id == users.userId)[0])
    });
    return this.listUsers
  }

  getIdUserByEmail(email: string) {
    if (dummy.users.filter(u => u.email == email).length !== 0) {
      return dummy.users.filter(u => u.email == email)[0].id;
    } else {
      return null;
    }
  }

  registerNewUser(user: JUser) {
    // let body = user;
    // const body = {
    //   newState: "running"
    // }
    dummy.users.push(user);
    console.log(dummy.users);
    // return this.http.post(environment.apiUrl + 'api/v1/user/' + user.id, body);
  }
}
