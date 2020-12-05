import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JUser } from '@trungk18/interface/user';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { DateUtil } from '@trungk18/project/utils/date';
import { UsersService } from '@trungk18/project/services/users.service'

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  validateForm!: FormGroup;
  loading = false;
  selectedImg: any;
  avatarUrl?: string;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  constructor(private fb: FormBuilder,
    private storage: AngularFireStorage,
    private usersService: UsersService,
    // private msg: NzMessageService
    ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      nickname: [null, [Validators.required]],
    });
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

  async register() {
    let id: string = uuid();
    let now = DateUtil.getNow();
    let filePath = `images/${this.selectedImg.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
    const fileRef = this.storage.ref(filePath);
    let upload = this.storage.upload(filePath, this.selectedImg).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.avatarUrl = url;
          let newUser: JUser = {
            id: id,
            name: this.validateForm.get('nickname').value,
            email: this.validateForm.get('email').value,
            password: this.validateForm.get('password').value,
            description: null,
            avatarUrl: this.avatarUrl,
            createdAt: now,
            updatedAt: null,
            projectAdmin: ''
          };
          this.usersService.registerNewUser(newUser).subscribe(
            () => {
              window.location.href = '/login';
            }
          )
        })
      })
    ).subscribe();
  }

  login() {
    window.location.href = '/login';
  }
}
