import { Component, OnInit } from '@angular/core';
import { ProjectConst } from '@trungk18/project/config/const';
import { JProject, JProjectCategories, JProjects, ProjectCategory } from '@trungk18/interface/project';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProjectService } from '@trungk18/project/state/project/project.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NoWhitespaceValidator } from '@trungk18/core/validators/no-whitespace.validator';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectsService } from '@trungk18/project/services/projects.service';
import { ProjectsCategoriesService } from '@trungk18/project/services/projects-categories.service';
import { UsersService } from '@trungk18/project/services/users.service';
import { JUser } from '@trungk18/interface/user';
import { IssueDeleteModalComponent } from '@trungk18/project/components/issues/issue-delete-modal/issue-delete-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
@UntilDestroy()
export class SettingsComponent implements OnInit {
  projectForm: FormGroup;
  categories: JProjectCategories[] = [];
  nameProject: string = '';
  projectsId: number;
  project: JProjects;
  members: any;
  get breadcrumbs(): string[] {
    return [ProjectConst.Projects, this.nameProject, 'Settings'];
  }

  constructor(
    private _projectQuery: ProjectQuery,
    private _projectService: ProjectService,
    private _notification: NzNotificationService,
    private _fb: FormBuilder,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private projectsCategoriesService: ProjectsCategoriesService,
    private usersService: UsersService,
    private _modalService: NzModalService
  ) {
    this.nameProject = this.activatedRoute.snapshot.paramMap.get("nameProject");
  }

  async ngOnInit() {
    this.initForm();

    let getAllCategory = this.projectsCategoriesService.getAllCategory().toPromise().then(
      (data: any) => {
        this.categories = data;
      }
    )
    await Promise.all([getAllCategory]);

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
    this.usersService.getUsersInProjects(this.projectsId).subscribe (
      (data) => {
        this.members = data;
      }
    )
    this.updateForm(this.project);
  }

  initForm() {
    this.projectForm = this._fb.group({
      name: ['', NoWhitespaceValidator()],
      description: [''],
      category: ['']
    });
  }

  updateForm(project: JProjects) {
    this.projectForm.patchValue({
      name: project.name,
      description: project.description,
      category: project.projectCategoriesId
    });
  }

  submitForm() {
    let formValue: Partial<JProject> = this.projectForm.getRawValue();
    console.log(formValue);
    this._projectService.updateProject(formValue);
    this._notification.create(
      "success",
      'Changes have been saved successfully.',
      ""      
    );
  }

  removeMember(userId: string, name: string) {
    this._modalService.create({
      nzContent: IssueDeleteModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzStyle: {
        top: "140px"
      },
      nzComponentParams: {
        title: "Are you sure you want to remove " + name +" from the projject?",
        data: userId + "," + this.projectsId,
        onDelete: null,
        delete: "jobs"
      }      
    });
  }

  cancel() {
    this._router.navigate(['/']);
  }
}
