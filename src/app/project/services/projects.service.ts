import { Injectable } from '@angular/core';
import dummy from 'src/assets/data/project.json';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor() { }

  getProjectsId(projectsName: string) {
    return dummy.projects.filter(u => u.name == projectsName)[0].id;
  }
}
