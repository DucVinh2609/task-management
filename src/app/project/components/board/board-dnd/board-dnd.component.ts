import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { JIssueStatus } from '@trungk18/interface/issue';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectsService } from '@trungk18/project/services/projects.service';
import { IssueStatusService } from '@trungk18/project/services/issue-status.service';
import dummy from 'src/assets/data/project.json';

@UntilDestroy()
@Component({
  selector: 'board-dnd',
  templateUrl: './board-dnd.component.html',
  styleUrls: ['./board-dnd.component.scss']
})
export class BoardDndComponent implements OnInit {
  issueStatuses: JIssueStatus[] = [];
  checkAddDndList: boolean = false;
  titleListTask: string = '';
  nameProject: string = '';
  projectsId: number;
  checkAdmin: boolean = false;

  constructor(public projectQuery: ProjectQuery,
    public authQuery: AuthQuery,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private issueStatusService: IssueStatusService) {
      this.nameProject = this.activatedRoute.snapshot.paramMap.get("nameProject");
      this.projectsId = this.projectsService.getProjectsId(this.nameProject);
      this.issueStatuses = this.issueStatusService.getStatusByProjectId(this.projectsId).sort((a, b) => (a.position > b.position) ? 1 : -1);
      this.authQuery.user$.subscribe(user => {
        this.checkAdmin = user.projectAdmin.includes(this.projectsId);
      });
  }

  ngOnInit(): void {

  }

  getData() {
    this.issueStatuses = this.issueStatusService.getStatusByProjectId(this.projectsId).sort((a, b) => (a.position > b.position) ? 1 : -1);
  }

  addDndList() {
    this.checkAddDndList = true;
  }

  addListTask() {
    this.issueStatusService.createIssueStatus(this.titleListTask, this.projectsId);
    this.checkAddDndList = false;
    this.titleListTask = '';
    this.getData();
  }

  cancelAddListTask() {
    this.checkAddDndList = false;
    this.titleListTask = '';
  }
}
