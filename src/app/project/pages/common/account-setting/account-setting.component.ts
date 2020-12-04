import { Component, OnInit } from '@angular/core';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { AuthService, LoginPayload } from '@trungk18/project/auth/auth.service';
import { ProjectConst } from '@trungk18/project/config/const';
import { JProject, JProjectCategories, JProjects, ProjectCategory } from '@trungk18/interface/project';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '@trungk18/project/state/project/project.service';
import { NoWhitespaceValidator } from '@trungk18/core/validators/no-whitespace.validator';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectsService } from '@trungk18/project/services/projects.service';
import { ProjectsCategoriesService } from '@trungk18/project/services/projects-categories.service';
import { UsersService } from '@trungk18/project/services/users.service';
import { JUser } from '@trungk18/interface/user';
import { IssueDeleteModalComponent } from '@trungk18/project/components/issues/issue-delete-modal/issue-delete-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { JobsService } from '@trungk18/project/services/jobs.service';
import { ListJobsService } from '@trungk18/project/services/list-jobs.service';
import { IssuesService } from '@trungk18/project/services/issues.service';

@Component({
  selector: 'account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss']
})
export class AccountSettingComponent implements OnInit {
  accountSettingForm: FormGroup;
  changePasswordForm: FormGroup;
  categories: JProjectCategories[] = [];
  nameProject: string = '';
  projectsId: number;
  project: JProjects;
  members: JUser[] = [];
  loading = false;
  selectedImg: any;
  avatarUrl?: string;
  currentUserId: string = localStorage.getItem('token');
  currentUser: JUser;
  taskIsDeadlines: any = [];
  taskIsOvers: any = [];
  taskIsComings: any = [];

  constructor(public authQuery: AuthQuery,
    private _router: Router,
    private _projectQuery: ProjectQuery,
    private _projectService: ProjectService,
    private _fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private projectsCategoriesService: ProjectsCategoriesService,
    private usersService: UsersService,
    private jobsService: JobsService,
    private listJobsService: ListJobsService,
    private issuesService: IssuesService,
    private _modalService: NzModalService) { }

  ngOnInit(): void {
    this.taskIsDeadlines = [];
    this.taskIsOvers = [];
    this.taskIsComings = [];
    this.currentUser = this.usersService.getUsersById(this.currentUserId);
    this.initForm();
    this.updateForm();
    this.accountSettingForm.controls['email'].disable();
    // let jobOfUsers = this.jobsService.getListJobIsDeadlineOfUser(this.currentUser.id);
    // this.getDataIssue(jobOfUsers);
    let ListIssuesByUserIdS = this.issuesService.getListIssuesByUserId(this.currentUser.id);
    ListIssuesByUserIdS.forEach(jobOfUser => {
      if (this.checkDate(new Date(jobOfUser.deadlineAt), '=')) {
        this.taskIsDeadlines.push(jobOfUser);
      }
      if (this.checkDate(new Date(jobOfUser.deadlineAt), '<')) {
        this.taskIsOvers.push(jobOfUser);
      }
      if (this.checkDate(new Date(jobOfUser.deadlineAt), '>')) {
        this.taskIsComings.push(jobOfUser);
      }
    });
  }

  getDataIssue(jobOfUsers) {
    let jobIsDeadline = [];
    let jobIsOrver = [];
    let jobIsComing = [];
    jobOfUsers.forEach(jobOfUser => {
      console.log(jobOfUser)
      if (this.checkDate(new Date(jobOfUser.deadlineAt), '=')) {
        jobIsDeadline.push(jobOfUser.listJobsId);
      }
      if (this.checkDate(new Date(jobOfUser.deadlineAt), '<')) {
        jobIsOrver.push(jobOfUser.listJobsId);
      }
      if (this.checkDate(new Date(jobOfUser.deadlineAt), '>')) {
        jobIsComing.push(jobOfUser.listJobsId);
      }
    });
    this.taskIsDeadlines = this.issuesService.getListIssuesOfJob(this.listJobsService.getListIdIssue(jobIsDeadline));
    this.taskIsOvers = this.issuesService.getListIssuesOfJob(this.listJobsService.getListIdIssue(jobIsOrver));
    this.taskIsComings = this.issuesService.getListIssuesOfJob(this.listJobsService.getListIdIssue(jobIsComing));
  }

  checkDate(date, operator) {
    let today = new Date();
    switch (operator) {
      case '=':
        return date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear();
      case '<':
        return date < today;
      case '>':
        return date.getDate() > today.getDate() &&
          date.getMonth() >= today.getMonth() &&
          date.getFullYear() >= today.getFullYear();
    }
  }

  initForm() {
    this.accountSettingForm = this._fb.group({
      email: [''],
      name: ['', NoWhitespaceValidator()],
      description: [''],
    });
    this.changePasswordForm = this._fb.group({
      passwordCurrent: ['', NoWhitespaceValidator()],
      newPassword: ['', NoWhitespaceValidator()],
      confỉmNewPassword: ['', [NoWhitespaceValidator(), this.confirmationValidator]],
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.changePasswordForm.controls.newPassword.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  updateForm() {
    this.accountSettingForm.patchValue({
      email: this.currentUser.email,
      name: this.currentUser.name,
      description: this.currentUser.description
    });
    this.avatarUrl = this.currentUser.avatarUrl;
  }

  submitForm() {
    let formValue: Partial<JProject> = this.accountSettingForm.getRawValue();
    console.log(formValue);
    this._projectService.updateProject(formValue);
  }

  cancel() {
    this._router.navigate(['/']);
  }

  home() {
    this._router.navigate(['index']);
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) => {
    this.selectedImg = file;
    console.log(this.selectedImg);
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        // this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        // this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });
  };

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    console.log(info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        // this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }
}
