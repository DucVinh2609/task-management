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
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { DateUtil } from '@trungk18/project/utils/date';
import moment, { localeData } from 'moment';

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
  load: boolean = false;
  messageErrorPass: string = '';
  messageSuccessPass: string = '';
  messageSuccessInfo: string = '';

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
    private storage: AngularFireStorage,
    private issuesService: IssuesService,
    private _modalService: NzModalService) { }

  async ngOnInit() {
    let getUsersById = this.usersService.getUsersById(this.currentUserId).toPromise().then(
      (data) => {
        if (data[0]) {
          this.currentUser = data[0];
          this.load = true;
        }
      }
    )
    await Promise.all([getUsersById]);
    this.taskIsDeadlines = [];
    this.taskIsOvers = [];
    this.taskIsComings = [];
    this.initForm();
    this.updateForm();
    this.accountSettingForm.controls['email'].disable();
    // let jobOfUsers = this.jobsService.getListJobIsDeadlineOfUser(this.currentUser.id);
    // this.getDataIssue(jobOfUsers);
    let ListIssuesByUserIdS = [];
    let getListIssuesByUserId = this.issuesService.getListIssuesByUserId(this.currentUser.id).toPromise().then(
      (data: any) => {
        ListIssuesByUserIdS = data;
      }
    )
    await Promise.all([getListIssuesByUserId]);
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

  async getDataIssue(jobOfUsers) {
    let jobIsDeadline = [];
    let jobIsOrver = [];
    let jobIsComing = [];
    let jobIsDeadlines = [];
    let jobIsOrvers = [];
    let jobIsComings = [];
    jobOfUsers.forEach(jobOfUser => {
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
    for (let i = 0; i < jobIsDeadline.length; i++) {
      let getIssueIdByListJobsId = this.listJobsService.getIssueIdByListJobsId(jobIsDeadline[i]).toPromise().then(
        (data) => {
          jobIsDeadlines.push(data[0].issueId);
        }
      )
      await Promise.all([getIssueIdByListJobsId]);
    }

    for (let i = 0; i < jobIsOrver.length; i++) {
      let getIssueIdByListJobsId = this.listJobsService.getIssueIdByListJobsId(jobIsOrver[i]).toPromise().then(
        (data) => {
          jobIsOrvers.push(data[0].issueId);
        }
      )
      await Promise.all([getIssueIdByListJobsId]);
    }

    for (let i = 0; i < jobIsComing.length; i++) {
      let getIssueIdByListJobsId = this.listJobsService.getIssueIdByListJobsId(jobIsComing[i]).toPromise().then(
        (data) => {
          jobIsComings.push(data[0].issueId);
        }
      )
      await Promise.all([getIssueIdByListJobsId]);
    }

    for (let i = 0; i < jobIsDeadlines.length; i++) {
      let getInfoIssue = this.issuesService.getInfoIssue(jobIsDeadlines[i]).toPromise().then(
        (data) => {
          this.taskIsDeadlines.push(data[0]);
        }
      )
      await Promise.all([getInfoIssue]);
    }

    for (let i = 0; i < jobIsOrvers.length; i++) {
      let getInfoIssue = this.issuesService.getInfoIssue(jobIsOrvers[i]).toPromise().then(
        (data) => {
          this.taskIsOvers.push(data[0]);
        }
      )
      await Promise.all([getInfoIssue]);
    }

    for (let i = 0; i < jobIsComings.length; i++) {
      let getInfoIssue = this.issuesService.getInfoIssue(jobIsComings[i]).toPromise().then(
        (data) => {
          this.taskIsComings.push(data[0]);
        }
      )
      await Promise.all([getInfoIssue]);
    }
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

  submitInfo() {
    let formValue = this.accountSettingForm.getRawValue();
    let updatedAt = new Date();
    if (this.selectedImg) {
      let filePath = `images/${this.selectedImg.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      let upload = this.storage.upload(filePath, this.selectedImg).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.avatarUrl = url;
            let body = {
              id: this.currentUserId,
              email: formValue.email,
              name: formValue.name,
              description: formValue.description,
              updatedAt: moment(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
              avatarUrl: this.avatarUrl,
            }
            this.usersService.updateUser(body).subscribe(
              () => {
                this.messageSuccessInfo = "Update Account Success";
              }
            )
          })
        })
      ).subscribe();
    } else {
      let body = {
        id: this.currentUserId,
        email: formValue.email,
        name: formValue.name,
        description: formValue.description,
        updatedAt: moment(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
        avatarUrl: this.currentUser.avatarUrl
      }
      this.usersService.updateUser(body).subscribe(
        () => {
          this.messageSuccessInfo = "Update Account Success";
        }
      )
    }
  }

  submitPassword() {
    let formValue = this.changePasswordForm.getRawValue();
    if (formValue.passwordCurrent !== this.currentUser.password) {
      this.messageErrorPass = "Password current incorrect";
      this.messageSuccessPass = "";
    } else {
        let body = {
        id: this.currentUserId,
        password: formValue.newPassword
      }
      this.usersService.changeNewPassword(body).subscribe(
        () => {
          this.messageSuccessPass = "Change password success";
          this.messageErrorPass = "";
        },
        () => {
          this.messageErrorPass = "Change password faild";
          this.messageSuccessPass = "";
        }
      )
    }
  }

  cancel() {
    this._router.navigate(['/']);
  }

  home() {
    this._router.navigate(['index']);
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) => {
    this.selectedImg = file;
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

  taskDetail(task: any) {
    this._router.navigate(['project/issue/' + task.id]);
  }
}
