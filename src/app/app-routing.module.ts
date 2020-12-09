import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from '@trungk18/project/pages/index/index.component';
import { ErrorComponent } from '@trungk18/project/pages/common/error/error.component';
import { LoginComponent } from '@trungk18/project/pages/common/login/login.component';
import { LogoutComponent } from '@trungk18/project/pages/common/logout/logout.component';
import { RegistrationComponent } from '@trungk18/project/pages/common/registration/registration.component';
import { BoardComponent } from '@trungk18/project/pages/board/board.component';
import { SettingsComponent } from '@trungk18/project/pages/settings/settings.component';
import { AccountSettingComponent } from '@trungk18/project/pages/common/account-setting/account-setting.component';
import { ProjectConst } from '@trungk18/project/config/const';
import { FullIssueDetailComponent } from '@trungk18/project/pages/full-issue-detail/full-issue-detail.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'index',
    component: IndexComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account-setting',
    component: AccountSettingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'project',
    loadChildren: () => import('./project/project.module').then((m) => m.ProjectModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'project/board/:nameProject',
    component: BoardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'project/board/:nameProject/settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: `project/issue/:nameProject/:${ProjectConst.IssueId}`,
    component: FullIssueDetailComponent
  },
  {
    path: 'wip',
    loadChildren: () =>
      import('./work-in-progress/work-in-progress.module').then(
        (m) => m.WorkInProgressModule
    ),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'error',
    component: ErrorComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
