import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { JIssueStatus } from '@trungk18/interface/issue';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectsService } from '@trungk18/project/services/projects.service';
import dummy from 'src/assets/data/project.json';

@UntilDestroy()
@Component({
  selector: 'board-dnd',
  templateUrl: './board-dnd.component.html',
  styleUrls: ['./board-dnd.component.scss']
})
export class BoardDndComponent implements OnInit {
  issueStatuses: JIssueStatus[] = dummy.status.sort((a, b) => (a.position > b.position) ? 1 : -1);
  checkAddDndList: boolean = false;
  titleListTask: string = '';
  nameProject: string = '';
  projectsId: number;

  constructor(public projectQuery: ProjectQuery,
    public authQuery: AuthQuery,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService) {
      this.nameProject = this.activatedRoute.snapshot.paramMap.get("nameProject");
    }

  ngOnInit(): void {
    this.projectsId = this.projectsService.getProjectsId(this.nameProject);
  }

  addDndList() {
    this.checkAddDndList = true;
  }

  addListTask() {
    let newListTask: JIssueStatus = {
      "id": 5,
      "position": 4,
      "status": this.titleListTask,
      "projectId": this.projectsId
    }
    this.issueStatuses.push(newListTask);
    this.checkAddDndList = false;
    this.titleListTask = '';
  }

  cancelAddListTask() {
    this.checkAddDndList = false;
    this.titleListTask = '';
  }
}
