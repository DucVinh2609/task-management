import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JProjectCategories, JProjects } from '@trungk18/interface/project'
import { quillConfiguration } from '@trungk18/project/config/editor';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ProjectService } from '@trungk18/project/state/project/project.service';
import { IssueUtil } from '@trungk18/project/utils/issue';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { JUser } from '@trungk18/interface/user';
import { tap } from 'rxjs/operators';
import { until } from 'protractor';
import { NoWhitespaceValidator } from '@trungk18/core/validators/no-whitespace.validator';
import { DateUtil } from '@trungk18/project/utils/date';
import dummy from 'src/assets/data/project.json';
import { ProjectsService} from '@trungk18/project/services/projects.service';
import { UsersService } from '@trungk18/project/services/users.service';
import { UserProjectsService } from '@trungk18/project/services/user-projects.service';
import { Router } from '@angular/router';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { ProjectsCategoriesService } from '@trungk18/project/services/projects-categories.service';
import { IssueStatusDisplay } from '@trungk18/interface/issue';
import { IssueStatusService } from '@trungk18/project/services/issue-status.service';

@Component({
  selector: 'add-project-modal',
  templateUrl: './add-project-modal.component.html',
  styleUrls: ['./add-project-modal.component.scss']
})
@UntilDestroy()
export class AddProjectModalComponent implements OnInit {
  reporterUsers$: Observable<JUser[]>;
  assignees$: Observable<JUser[]>;
  issueForm: FormGroup;
  editorOptions = quillConfiguration;
  priorities: JProjectCategories[] = [];
  currentUserId: string = localStorage.getItem('token');
  currentUser: JUser;

  get f() {
    return this.issueForm?.controls;
  }

  constructor(
    private _fb: FormBuilder,
    private _modalRef: NzModalRef,
    private _projectService: ProjectService,
    public _projectQuery: ProjectQuery,
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private userProjectsService: UserProjectsService,
    private projectsCategoriesService: ProjectsCategoriesService,
    private issueStatusService: IssueStatusService,
    public router: Router,
    public authQuery: AuthQuery
  ) {}

  ngOnInit(): void {
    this.usersService.getUsersById(this.currentUserId).subscribe(
      (data) => {
        if (data[0]) {
          this.currentUser = data[0];
        }
      }
    )

    this.projectsCategoriesService.getAllCategory().subscribe(
      (data: any) => {
        this.priorities = data;
      }
    )

    this.initForm();
  }

  initForm() {
    this.issueForm = this._fb.group({
      name: ['', NoWhitespaceValidator()],
      projectCategoriesId: [1]
    });
  }

  async submitForm() {
    if (this.issueForm.invalid) {
      return;
    }
    let now = DateUtil.getNow();
    let newProject: JProjects = {
      ...this.issueForm.getRawValue(),
      createdAt: now,
      updatedAt: null,
      description: null
    };

    let getAllIdOfProjects = this.projectsService.getAllIdOfProjects().toPromise().then(
      (data: any) => {
        newProject.id = data.sort((a, b) => (a.id < b.id) ? 1 : -1)[0].id + 1;
      }
    )
    await Promise.all([getAllIdOfProjects]);

    let newProjectId: number;
    let createProject = this.projectsService.createProject(newProject).toPromise().then(
      (data: any) => {
        newProjectId = data.data;
      }
    )
    await Promise.all([createProject]);

    IssueStatusDisplay.forEach(async issue => {
      let createIssueStatus = this.issueStatusService.createIssueStatus(issue.status, newProjectId, issue.position).subscribe(
        () => { }
      )
      await Promise.all([createIssueStatus]);
    });

    let updateAdminProjects = this.usersService.updateAdminProjects(this.currentUser, newProjectId.toString()).toPromise().then(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    )

    let getIdUserByEmail = this.usersService.getIdUserByEmail(this.currentUser.email).toPromise().then(
      async (data: any) => {
        if (data.length !== 0) {
          let body = {
            userId: data[0].id,
            projectId: newProjectId
          }
          let postProjectOfUsers = this.userProjectsService.postProjectOfUsers(body).toPromise().then(
            () => {},
            () => {}
          )
          await Promise.all([postProjectOfUsers]);
        }
      },
      () => {}
    )
    await Promise.all([updateAdminProjects, getIdUserByEmail]);
    this.closeModal();
    window.location.href = '/project/board/' + newProject.name;
    // this.router.navigate(['/project/board/' + newProject.name]);
  }

  cancel() {
    this.closeModal();
  }

  closeModal() {
    this._modalRef.close();
  }
}
