import { Component, OnInit } from '@angular/core';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { AuthService, LoginPayload } from '@trungk18/project/auth/auth.service';
import { Router } from '@angular/router';
// import { NzModalService } from 'ng-zorro-antd/modal';
import { AddProjectModalComponent } from '@trungk18/project/components/add-project-modal/add-project-modal.component';
import { ProjectsService } from '@trungk18/project/services/projects.service';
import { UserProjectsService } from '@trungk18/project/services/user-projects.service';

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  projectAdmins: any = [];
  projectClients: any = [];

  constructor(public authQuery: AuthQuery,
    private _authService: AuthService,
    private _router: Router,
    private projectsService: ProjectsService,
    private userProjectsService: UserProjectsService,
    // private _modalService: NzModalService
    ) {
  }

  ngOnInit(): void {
    this.projectAdmins = [];
    this.projectClients = [];
    // this._authService.login(new LoginPayload());
    this.authQuery.user$.subscribe(user => {
      console.log(user);
      this.projectAdmins = user.projectAdmin;
      if (this.projectAdmins) {
        this.projectAdmins = this.projectsService.getProjectsInforById(this.projectAdmins);
      }
      if (user.id && user.projectAdmin) {
        let userProjectClient = this.userProjectsService.getProjectOfUsers(user.id, user.projectAdmin);
        this.projectClients = this.projectsService.getProjectsInforById(userProjectClient);
      }
      
    });
  }

  home() {
    this._router.navigate(['index']);
  }

  // openCreateProjectModal() {
  //   this._modalService.create({
  //     nzContent: AddProjectModalComponent,
  //     nzClosable: false,
  //     nzFooter: null,
  //     nzWidth: 500
  //   });
  // }
}
