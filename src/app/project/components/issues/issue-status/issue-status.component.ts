import { Component, Input, OnInit } from '@angular/core';
import { JIssueStatus, JIssue } from '@trungk18/interface/issue';
import { ProjectService } from '@trungk18/project/state/project/project.service';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import dummy from 'src/assets/data/project.json';

@Component({
  selector: 'issue-status',
  templateUrl: './issue-status.component.html',
  styleUrls: ['./issue-status.component.scss']
})
export class IssueStatusComponent implements OnInit {
  @Input() issue: JIssue;
  issueStatuses: JIssueStatus[] = dummy.status.sort((a, b) => (a.position > b.position) ? 1 : -1);

  constructor(private _projectService: ProjectService, private _projectQuery: ProjectQuery) {}

  ngOnInit(): void {}

  updateIssue(status: string) {
    let newPosition = this._projectQuery.lastIssuePosition(status);
    this._projectService.updateIssue({
      ...this.issue,
      status,
      listPosition: newPosition + 1
    });
  }

  isStatusSelected(status: string) {
    return this.issue.status === status;
  }

  getIssueStatusDisplay(status: string) {
    return this.issueStatuses.filter(s => s.status === status)[0].status
  }
}
