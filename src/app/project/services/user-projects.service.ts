import { Injectable } from '@angular/core';
import dummy from 'src/assets/data/project.json';
import { UsersService } from '@trungk18/project/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class UserProjectsService {

  constructor(private usersService: UsersService) { }

  addUserProjects(email: string, projectId: number) {
    let userId = this.usersService.getIdUserByEmail(email);
    if (userId) {
      let newUserProjects = {
        "userId": userId,
        "projectId": projectId
      }
      dummy.userProjects.push(newUserProjects);
      return "success";
    } else {
      return "error";
    }
  }

  getProjectOfUsers(userId: string, projectId: any[]) {
    let userProjects = [];
    dummy.userProjects.forEach(userProject => {
      if (userId && userProject.userId.includes(userId) && !projectId.includes(userProject.projectId)) {
        userProjects.push(userProject.projectId);
      }
    });

    return userProjects;
  }
}
