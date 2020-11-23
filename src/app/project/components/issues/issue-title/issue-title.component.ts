import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JIssue } from '@trungk18/interface/issue';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { AuthQuery } from '@trungk18/project/auth/auth.query';

@Component({
  selector: 'issue-title',
  templateUrl: './issue-title.component.html',
  styleUrls: ['./issue-title.component.scss']
})
export class IssueTitleComponent implements OnChanges {
  @Input() issue: JIssue;
  @Input() projectsId: number;
  titleControl: FormControl;

  constructor(private issuesService: IssuesService,
    public authQuery: AuthQuery) {}

  ngOnChanges(changes: SimpleChanges): void {
    let issueChange = changes.issue;
    if (issueChange.currentValue !== issueChange.previousValue) {
      this.titleControl = new FormControl(this.issue.title);
    }
  }

  onBlur() {
    this.issuesService.updateIssue({
      ...this.issue,
      title: this.titleControl.value
    });
  }
}
