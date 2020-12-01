import { DragDropModule } from '@angular/cdk/drag-drop';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { AutofocusDirective } from '@trungk18/core/directives/autofocus.directive';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzTransButtonModule } from 'ng-zorro-antd/core/trans-button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzI18nModule } from 'ng-zorro-antd/i18n';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMentionModule } from 'ng-zorro-antd/mention';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { QuillModule } from 'ngx-quill';
import { JiraControlModule } from '../jira-control/jira-control.module';
import { AddIssueModalComponent } from './components/add-issue-modal/add-issue-modal.component';
import { IssueAssigneesSelectComponent } from './components/add-issue-modal/issue-assignees-select/issue-assignees-select.component';
import { IssuePrioritySelectComponent } from './components/add-issue-modal/issue-priority-select/issue-priority-select.component';
import { IssueReporterSelectComponent } from './components/add-issue-modal/issue-reporter-select/issue-reporter-select.component';
import { IssueTypeSelectComponent } from './components/add-issue-modal/issue-type-select/issue-type-select.component';
import { BoardPageComponents } from './components/board';
import { IssueUtilComponents } from './components/issues';
import { NavigationComponents } from './components/navigation';
import { ResizerComponent } from './components/navigation/resizer/resizer.component';
import { IssueResultComponent } from './components/search/issue-result/issue-result.component';
import { SearchDrawerComponent } from './components/search/search-drawer/search-drawer.component';
import { UserComponent } from './components/user/user.component';
import { NZ_JIRA_ICONS } from './config/icons';
import { BoardComponent } from './pages/board/board.component';
import { FullIssueDetailComponent } from './pages/full-issue-detail/full-issue-detail.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AddProjectModalComponent } from './components/add-project-modal/add-project-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CategoriesSelectComponent } from './components/add-project-modal/categories-select/categories-select.component';
import { GroupsSelectComponent } from './components/add-project-modal/groups-select/groups-select.component';
import { ErrorComponent } from '@trungk18/project/pages/common/error/error.component';
import { IndexComponent } from './pages/index/index.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoginComponent } from './pages/common/login/login.component';
import { IssueJobsComponent } from './components/issues/issue-jobs/issue-jobs.component';
import { IssueDeadlineComponent } from './components/issues/issue-deadline/issue-deadline.component';
import { RegistrationComponent } from './pages/common/registration/registration.component';
import { InviteMemberModalComponent } from './components/invite-member-modal/invite-member-modal.component';
import { AccountSettingComponent } from './pages/common/account-setting/account-setting.component';

@NgModule({
  declarations: [
    AutofocusDirective,
    ...NavigationComponents,
    ...BoardPageComponents,
    ...IssueUtilComponents,
    ProjectComponent,
    BoardComponent,
    SettingsComponent,
    FullIssueDetailComponent,
    SearchDrawerComponent,
    IssueResultComponent,
    AddIssueModalComponent,
    UserComponent,
    IssueTypeSelectComponent,
    IssuePrioritySelectComponent,
    IssueReporterSelectComponent,
    IssueAssigneesSelectComponent,
    ResizerComponent,
    AddProjectModalComponent,
    CategoriesSelectComponent,
    GroupsSelectComponent,
    ErrorComponent,
    IndexComponent,
    LoginComponent,
    IssueJobsComponent,
    IssueDeadlineComponent,
    RegistrationComponent,
    InviteMemberModalComponent,
    AccountSettingComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    NzIconModule.forChild(NZ_JIRA_ICONS),
    NzToolTipModule,
    NzProgressModule,
    NzModalModule,
    NzDropDownModule,
    NzSelectModule,
    NzNotificationModule,
    NzPopoverModule,
    NzAffixModule,
    NzAlertModule,
    NzAnchorModule,
    NzAutocompleteModule,
    NzAvatarModule,
    NzBackTopModule,
    NzBadgeModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzCalendarModule,
    NzCardModule,
    NzCarouselModule,
    NzCascaderModule,
    NzCheckboxModule,
    NzCollapseModule,
    NzCommentModule,
    NzDatePickerModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzDrawerModule,
    NzDropDownModule,
    NzEmptyModule,
    NzFormModule,
    NzGridModule,
    NzI18nModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NzLayoutModule,
    NzListModule,
    NzMentionModule,
    NzMenuModule,
    NzMessageModule,
    NzModalModule,
    NzNoAnimationModule,
    NzNotificationModule,
    NzPageHeaderModule,
    NzPaginationModule,
    NzPopconfirmModule,
    NzProgressModule,
    NzRadioModule,
    NzRateModule,
    NzResultModule,
    NzSelectModule,
    NzSkeletonModule,
    NzSliderModule,
    NzSpinModule,
    NzStatisticModule,
    NzStepsModule,
    NzSwitchModule,
    NzTableModule,
    NzTabsModule,
    NzTagModule,
    NzTimePickerModule,
    NzTimelineModule,
    NzToolTipModule,
    NzTransButtonModule,
    NzTransferModule,
    NzTreeModule,
    NzTreeSelectModule,
    NzTypographyModule,
    NzUploadModule,
    NzWaveModule,
    NzResizableModule,
    DragDropModule,
    TextFieldModule,
    FormsModule,
    ReactiveFormsModule,
    JiraControlModule,
    ContentLoaderModule,
    QuillModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatCardModule,
    MatProgressBarModule
  ]
})
export class ProjectModule {}
