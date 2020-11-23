import { Injectable } from '@angular/core';
import { JProjects } from '@trungk18/interface/project';
import dummy from 'src/assets/data/project.json';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor() { }

  getProjectsId(projectsName: string) {
    return dummy.projects.filter(u => u.name == projectsName)[0].id;
  }

  createProject(newProjects: JProjects) {
    newProjects.id = dummy.projects.sort((a, b) => (a.id < b.id) ? 1 : -1)[0].id + 1;
    dummy.projects.push(newProjects);
    return newProjects.id;
  }
}
