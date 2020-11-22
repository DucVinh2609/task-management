import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { JIssue } from '@trungk18/interface/issue';
import { IssuePriorityIcon } from '@trungk18/interface/issue-priority-icon';
import { IssueUtil } from '@trungk18/project/utils/issue';
import { ProjectService } from '@trungk18/project/state/project/project.service';
import { ProjectConst } from '@trungk18/project/config/const';
import { IssuePrioritiesService } from '@trungk18/project/services/issue-priorities.service';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { AuthQuery } from '@trungk18/project/auth/auth.query';

@Component({
  selector: 'issue-priority',
  templateUrl: './issue-priority.component.html',
  styleUrls: ['./issue-priority.component.scss']
})
export class IssuePriorityComponent implements OnInit, OnChanges {
  selectedPriority: number;

  get selectedPriorityIcon() {
    return IssueUtil.getIssuePriorityIcon(this.selectedPriority);
  }

  priorities: IssuePriorityIcon[];

  @Input() issue: JIssue;
  @Input() projectsId: number;

  constructor(private _projectService: ProjectService,
    private issuePrioritiesService: IssuePrioritiesService,
    private issuesService: IssuesService,
    public authQuery: AuthQuery) {}

  ngOnInit() {
    this.priorities = ProjectConst.PrioritiesWithIcon;
  }

  ngOnChanges(): void {
    this.selectedPriority = this.issue?.issuePriorityId;
  }

  isPrioritySelected(priority) {
    return priority === this.selectedPriority;
  }

  updateIssue(priority) {
    this.selectedPriority = priority;
    let newIssue: JIssue = { ...this.issue };
    newIssue.issuePriorityId = priority;
    this.issuesService.updateIssue(newIssue);
  }

  getIssuePriorities(issuePrioritiesId) {
    return this.issuePrioritiesService.getIssuePriorities(issuePrioritiesId);
  }
}
