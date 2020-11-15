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

@Component({
  selector: 'issue-card',
  templateUrl: './issue-card.component.html',
  styleUrls: ['./issue-card.component.scss']
})
@UntilDestroy()
export class IssueCardComponent implements OnChanges {
  @Input() issue: JIssue;
  assignees: JUser[] = [];
  issueTypeIcon: string;
  priorityIcon: IssuePriorityIcon;
  issueTypesName: string = '';

  constructor(private _projectQuery: ProjectQuery,
    private _modalService: NzModalService,
    private issueTypesService: IssueTypesService,
    private usersService: UsersService) {}

  ngOnInit(): void {
    this.issueTypesName = this.issueTypesService.getTypesName(this.issue.issueTypeId);
    this.issue.userIds.forEach(users => {
      this.assignees.push(this.usersService.getUsersById(users))
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    let issueChange = changes.issue;
    if (issueChange?.currentValue !== issueChange.previousValue) {
      this.issueTypeIcon = IssueUtil.getIssueTypeIcon(this.issue.issueTypeId);
      this.priorityIcon = IssueUtil.getIssuePriorityIcon(this.issue.issuePriorityId);
    }
  }

  openIssueModal(issueId: string) {
    this._modalService.create({
      nzContent: IssueModalComponent,
      nzWidth: 1040,
      nzClosable: false,
      nzFooter: null,
      nzComponentParams: {
        issue$: this._projectQuery.issueById$(issueId)
      }
    });
  }
}
