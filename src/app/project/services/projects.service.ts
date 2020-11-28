import { Injectable } from '@angular/core';
import { JProjects } from '@trungk18/interface/project';
import { IssueStatusDisplay } from '@trungk18/interface/issue';
import { IssueStatusService } from '@trungk18/project/services/issue-status.service';
import dummy from 'src/assets/data/project.json';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private issueStatusService: IssueStatusService) { }

  getProjectsId(projectsName: string) {
    return dummy.projects.filter(u => u.name == projectsName)[0].id;
  }

  getProjectsInfo(projectCategoriesId: number) {
    return dummy.projects.filter(u => u.id == projectCategoriesId)[0];
  }

  createProject(newProjects: JProjects) {
    newProjects.id = dummy.projects.sort((a, b) => (a.id < b.id) ? 1 : -1)[0].id + 1;
    dummy.projects.push(newProjects);
    IssueStatusDisplay.forEach(issue => {
      this.issueStatusService.createIssueStatus(issue.status, newProjects.id);
    });
    return newProjects.id;
  }
}
