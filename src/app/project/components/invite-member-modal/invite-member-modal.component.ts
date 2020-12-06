import { Component, OnInit } from '@angular/core';
import { NoWhitespaceValidator } from '@trungk18/core/validators/no-whitespace.validator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Validators } from '@angular/forms';
import { UserProjectsService } from '@trungk18/project/services/user-projects.service';
import { emit } from 'process';
import { UsersService } from '@trungk18/project/services/users.service';

@Component({
  selector: 'invite-member-modal',
  templateUrl: './invite-member-modal.component.html',
  styleUrls: ['./invite-member-modal.component.scss']
})
export class InviteMemberModalComponent implements OnInit {
  inviteMemberForm: FormGroup;
  error: boolean = false;
  projectsId: number;

  get f() {
    return this.inviteMemberForm?.controls;
  }

  constructor(
    private _fb: FormBuilder,
    private _modalRef: NzModalRef,
    private usersService: UsersService,
    private userProjectsService: UserProjectsService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.inviteMemberForm = this._fb.group({
      email: ['', [NoWhitespaceValidator(), Validators.email]]
    });
  }

  async submitForm() {
    if (this.inviteMemberForm.invalid) {
      return;
    }
    let result = '';
    let getIdUserByEmail = this.usersService.getIdUserByEmail(this.inviteMemberForm.get('email').value).toPromise().then(
      async (data: any) => {
        if (data.length !== 0) {
          let body = {
            userId: data[0].id,
            projectId: this.projectsId
          }
          let postProjectOfUsers = this.userProjectsService.postProjectOfUsers(body).toPromise().then(
            () => {
              result = 'success';
            },
            () => {
              result = 'error';
            }
          )
          await Promise.all([postProjectOfUsers]);
        } else {
          result = 'error';
        }
      },
      () => {
        result = 'error';
      }
    )
    await Promise.all([getIdUserByEmail]);
    if (result == 'error') {
      this.error = true;
    } else if (result == 'success') {
      this.closeModal();
    }
    // this._modalRef.destroy({ result: result});
  }

  cancel() {
    this.closeModal();
  }

  closeModal() {
    this._modalRef.close();
  }

}
