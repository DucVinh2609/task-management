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

  get sidebarWidth(): number {
    return this.expanded ? 240 : 15;
  }

  sideBarLinks: SideBarLink[];

  constructor(private _projectQuery: ProjectQuery,
    private _modalService: NzModalService,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private projectsCategoriesService: ProjectsCategoriesService) {
    // this._projectQuery.all$.pipe(untilDestroyed(this)).subscribe((project) => {
    //   this.project = project;
    // });
    this.nameProject = this.activatedRoute.snapshot.paramMap.get("nameProject");
  }

  ngOnInit(): void {
    this.projectsId = this.projectsService.getProjectsId(this.nameProject);
    this.project = this.projectsService.getProjectsInfo(this.projectsId);
    this.projectCategory = this.projectsCategoriesService.getCategoryName(this.project.projectCategoriesId);
    this.sideBarLinks = [
      new SideBarLink('Board', 'board', '/project/board/' + this.nameProject),
      new SideBarLink('Project Settings', 'cog', '/project/board/' + this.nameProject + '/settings')
    ];
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
