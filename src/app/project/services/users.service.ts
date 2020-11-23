import { Injectable } from '@angular/core';
import { JUser, JUserProjects } from 'src/app/interface/user';
import dummy from 'src/assets/data/project.json';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  listUserProjects: JUserProjects[] = [];
  listUsers: JUser[] = [];
  users: JUser;
  constructor() { }

  getUsersById(userId: string) {
    this.users = dummy.users.filter(u => u.id == userId)[0];
    if (this.users) {
      return this.users
    }
  }

  getUsersInProjects(projectId: number) {
    this.listUserProjects = dummy.userProjects.filter(u => u.projectId == projectId);
    this.listUserProjects.forEach(users => {
      this.listUsers.push(dummy.users.filter(u => u.id == users.userId)[0])
    });
    return this.listUsers
  }
}
