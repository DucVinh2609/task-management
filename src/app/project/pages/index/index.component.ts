import { Component, OnInit } from '@angular/core';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { AuthService, LoginPayload } from '@trungk18/project/auth/auth.service';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddProjectModalComponent } from '@trungk18/project/components/add-project-modal/add-project-modal.component';
import { ProjectsService } from '@trungk18/project/services/projects.service';
import { UserProjectsService } from '@trungk18/project/services/user-projects.service';
import { UsersService } from '@trungk18/project/services/users.service';
import { JUser } from '@trungk18/interface/user';

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  currentUserId: string = localStorage.getItem('token');
  currentUser: JUser;
  projectAdmins: any = [];
  projectClients: any = [];

  constructor(public authQuery: AuthQuery,
    private _authService: AuthService,
    private _router: Router,
    private projectsService: ProjectsService,
    private userProjectsService: UserProjectsService,
    private usersService: UsersService,
    private _modalService: NzModalService
    ) {
  }

  async ngOnInit() {
    this.projectAdmins = [];
    this.projectClients = [];
    let getUsersById = this.usersService.getUsersById(this.currentUserId).subscribe(
      async (data) => {
        this.currentUser = data[0];
        let projectAdmin = this.currentUser.projectAdmin.split(',');
        let projectClient = [];

        if (projectAdmin.length > 0) {
          for (let i = 0; i < projectAdmin.length; i++) {
            let getProjectsInfo = this.projectsService.getProjectsInfo(projectAdmin[i]).toPromise().then(
              (data) => {
                this.projectAdmins.push(data[0]);
              }
            )
            await Promise.all([getProjectsInfo]);
          }
        }

        let getProjectOfUsers = this.userProjectsService.getProjectOfUsers(this.currentUser.id).toPromise().then(
          (data: any) => {
            data.forEach(project => {
              if (!projectAdmin.includes(project.projectId.toString())) {
                projectClient.push(project.projectId);
              }
            });
          }
        )
        await Promise.all([getProjectOfUsers]);

        if (projectClient.length > 0) {
          for (let i = 0; i < projectClient.length; i++) {
            let getProjectsInfo = this.projectsService.getProjectsInfo(projectClient[i]).toPromise().then(
              (data) => {
                this.projectClients.push(data[0]);
              }
            )
            await Promise.all([getProjectsInfo]);
          }
        }

      }
    );
    await Promise.all([getUsersById]);
    // this.currentUser = this.usersService.getUsersById(this.currentUserId);
    
  }

  home() {
    this._router.navigate(['index']);
  } 

  openCreateProjectModal() {
    this._modalService.create({
      nzContent: AddProjectModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 500
    });
  }

  accountSetting() {
    this._router.navigate(['account-setting']);
  }

  projectBoard(nameProject: string) {
    this._router.navigate(['/project/board/' + nameProject]);
  }
}
