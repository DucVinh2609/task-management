import { Component, OnInit } from '@angular/core';
import { JIssueStatus } from '@trungk18/interface/issue';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectsService } from '@trungk18/project/services/projects.service';
import { IssueStatusService } from '@trungk18/project/services/issue-status.service';
import dummy from 'src/assets/data/project.json';
import { JUser } from '@trungk18/interface/user';
import { UsersService } from '@trungk18/project/services/users.service';

@Component({
  selector: 'board-dnd',
  templateUrl: './board-dnd.component.html',
  styleUrls: ['./board-dnd.component.scss']
})
export class BoardDndComponent implements OnInit {
  currentUserId: string = localStorage.getItem('token');
  currentUser: JUser;
  issueStatuses: JIssueStatus[] = [];
  checkAddDndList: boolean = false;
  titleListTask: string = '';
  nameProject: string = '';
  projectsId: number;
  checkAdmin: boolean = false;

  constructor(public projectQuery: ProjectQuery,
    public authQuery: AuthQuery,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private issueStatusService: IssueStatusService) {
      this.nameProject = this.activatedRoute.snapshot.paramMap.get("nameProject");
  }

  async ngOnInit() {
    let getUsersById = this.usersService.getUsersById(this.currentUserId).toPromise().then(
      (data) => {
        if (data[0]) {
          this.currentUser = data[0];
        }
      }
    )

    let getProjectsId = this.projectsService.getProjectsId(this.nameProject).toPromise().then(
      (data) => {
        this.projectsId = data[0].id;
      }
    )

    await Promise.all([getUsersById, getProjectsId]);
    this.getData();
    this.checkAdmin = this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString());
  }

  getData() {
    this.issueStatusService.getStatusByProjectId(this.projectsId).subscribe(
      (data: any) => {
        this.issueStatuses = data.sort((a, b) => (a.position > b.position) ? 1 : -1);
      }
    )
  }

  addDndList() {
    this.checkAddDndList = true;
  }

  addListTask() {
    this.issueStatusService.createIssueStatus(this.titleListTask, this.projectsId, this.issueStatuses.length).subscribe(
      () => {
        this.checkAddDndList = false;
        this.titleListTask = '';
        this.getData();
      }
    )
  }

  cancelAddListTask() {
    this.checkAddDndList = false;
    this.titleListTask = '';
  }
}
