import { Injectable } from '@angular/core';
import dummy from 'src/assets/data/project.json';

@Injectable({
  providedIn: 'root'
})
export class UserProjectsService {

  constructor() { }
  
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
