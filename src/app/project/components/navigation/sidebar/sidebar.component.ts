import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { JProject, JProjects } from '@trungk18/interface/project';
import { SideBarLink } from '@trungk18/interface/ui-model/nav-link';
import { SideBarLinks } from '@trungk18/project/config/sidebar';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddProjectModalComponent } from '@trungk18/project/components/add-project-modal/add-project-modal.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectsService } from '@trungk18/project/services/projects.service';
import { ProjectsCategoriesService } from '@trungk18/project/services/projects-categories.service';
import { JUser } from '@trungk18/interface/user';
import { UsersService } from '@trungk18/project/services/users.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
@UntilDestroy()
export class SidebarComponent implements OnInit {
  @Input() expanded: boolean;
  nameProject: string = '';
  projectsId: number;
  project: JProjects;
  projectCategory: string = '';
  currentUsersId: string = localStorage.getItem('token');
  currentUser: JUser;
  checkAdmin: boolean = false;

  get sidebarWidth(): number {
    return this.expanded ? 240 : 15;
  }

  sideBarLinks: SideBarLink[];

  constructor(private _projectQuery: ProjectQuery,
    private _modalService: NzModalService,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private projectsCategoriesService: ProjectsCategoriesService) {
    // this._projectQuery.all$.pipe(untilDestroyed(this)).subscribe((project) => {
    //   this.project = project;
    // });
    this.nameProject = this.activatedRoute.snapshot.paramMap.get("nameProject");
  }

  async ngOnInit() {
    let getProjectsId = this.projectsService.getProjectsId(this.nameProject).toPromise().then(
      (data) => {
        this.projectsId = data[0].id;
      }
    )
    await Promise.all([getProjectsId]);
    let getProjectsInfo = this.projectsService.getProjectsInfo(this.projectsId.toString()).toPromise().then(
      (data) => {
        this.project = data[0];
      }
    )
    await Promise.all([getProjectsInfo]);
    let getCategoryName = this.projectsCategoriesService.getCategoryName(this.project.projectCategoriesId).toPromise().then(
      (data) => {
        this.projectCategory = data[0].category;
      }
    )
    await Promise.all([getCategoryName]);

    let getUsersById = this.usersService.getUsersById(this.currentUsersId).toPromise().then(
      (data) => {
        if (data[0]) {
          this.currentUser = data[0];
        }
      }
    );
    await Promise.all([getUsersById]);

    let projectAdmin = [];
    if (this.currentUser.projectAdmin) {
      projectAdmin = this.currentUser.projectAdmin.split(',');
      this.checkAdmin = this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString());
    } else {
      this.checkAdmin = false;
    }
    if (this.checkAdmin) {
      this.sideBarLinks = [
        new SideBarLink('Board', 'board', '/project/board/' + this.nameProject),
        new SideBarLink('Project Settings', 'cog', '/project/board/' + this.nameProject + '/settings')
      ];
    } else {
      this.sideBarLinks = [
        new SideBarLink('Board', 'board', '/project/board/' + this.nameProject)
      ];
    }
    
  }

  openCreateProjectModal() {
    this._modalService.create({
      nzContent: AddProjectModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 500
    });
  }
}
