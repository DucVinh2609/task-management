import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { JIssue } from '@trungk18/interface/issue';
import { IssuePriorityIcon } from '@trungk18/interface/issue-priority-icon';
import { JUser } from '@trungk18/interface/user';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { IssueUtil } from '@trungk18/project/utils/issue';
import { NzModalService } from 'ng-zorro-antd/modal';
import { IssueModalComponent } from '../issue-modal/issue-modal.component';
import { UsersService } from 'src/app/project/services/users.service';
import { IssueTypesService } from 'src/app/project/services/issue-types.service';
import { IssuesService } from 'src/app/project/services/issues.service';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectsService } from '@trungk18/project/services/projects.service';

@Component({
  selector: 'issue-card',
  templateUrl: './issue-card.component.html',
  styleUrls: ['./issue-card.component.scss']
})
@UntilDestroy()
export class IssueCardComponent implements OnChanges {
  @Input() issue: JIssue;
  @Input() assignees: JUser[];
  issueTypeIcon: string;
  priorityIcon: IssuePriorityIcon;
  issueTypesName: string = '';
  projectsId: number;
  nameProject: string = '';

  constructor(private _projectQuery: ProjectQuery,
    public authQuery: AuthQuery,
    private _modalService: NzModalService,
    private issueTypesService: IssueTypesService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private issuesService: IssuesService) {
      this.nameProject = this.activatedRoute.snapshot.paramMap.get("nameProject");
    }

  ngOnInit(): void {
    this.issueTypesName = this.issueTypesService.getTypesName(this.issue.issueTypeId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.projectsId = this.projectsService.getProjectsId(this.nameProject);
    let issueChange = changes.issue;
    // if (issueChange?.currentValue !== issueChange.previousValue) {
    //   this.issueTypeIcon = IssueUtil.getIssueTypeIcon(this.issue.issueTypeId);
    //   this.priorityIcon = IssueUtil.getIssuePriorityIcon(this.issue.issuePriorityId);
    // }
    this.issueTypeIcon = IssueUtil.getIssueTypeIcon(this.issue.issueTypeId);
    this.priorityIcon = IssueUtil.getIssuePriorityIcon(this.issue.issuePriorityId);
  }

  openIssueModal(issueId: string) {
    this.authQuery.user$.subscribe(user => {
      if (this.issue.userIds.includes(user.id) || user.projectAdmin.includes(this.projectsId)) {
        this._modalService.create({
          nzContent: IssueModalComponent,
          nzWidth: 1040,
          nzClosable: false,
          nzFooter: null,
          nzComponentParams: {
            issue: this.issuesService.getInfoIssue(issueId),
            projectsId: this.projectsId
          }
        });
      }
    });
  }
}
