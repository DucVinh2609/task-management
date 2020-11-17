import { Component, OnInit, Input } from '@angular/core';
import { JIssue } from '@trungk18/interface/issue';
import { IssuesService } from '@trungk18/project/services/issues.service';

@Component({
  selector: 'issue-deadline',
  templateUrl: './issue-deadline.component.html',
  styleUrls: ['./issue-deadline.component.scss']
})
export class IssueDeadlineComponent implements OnInit {
  @Input() issue: JIssue;
  deadline: Date | null = null;
  constructor(private issuesService: IssuesService) { }

  ngOnInit(): void {
  }

  handleDeadlineOpenChange(open: boolean) {
    if(!open) {
      let newIssue: JIssue = { ...this.issue };
      if(this.deadline) {
        newIssue.deadlineAt = this.deadline.toLocaleString();
        this.issuesService.updateIssue(newIssue);
        console.log(newIssue);
      }
    }
  }
}
