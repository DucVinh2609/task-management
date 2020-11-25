import { Component, OnInit, Input } from '@angular/core';
import { JIssue } from '@trungk18/interface/issue';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { AuthQuery } from '@trungk18/project/auth/auth.query';

@Component({
  selector: 'issue-deadline',
  templateUrl: './issue-deadline.component.html',
  styleUrls: ['./issue-deadline.component.scss']
})
export class IssueDeadlineComponent implements OnInit {
  @Input() issue: JIssue;
  @Input() projectsId: number;
  deadline: Date | null = null;
  deadlineLimit: number;
  now = Date.now();
  isDisabledDeadline: boolean = true;
  constructor(private issuesService: IssuesService,
    public authQuery: AuthQuery) { }

  ngOnInit(): void {
    if(this.issuesService.getInfoIssue(this.issue.id).deadlineAt) {
      this.deadline = new Date(this.issuesService.getInfoIssue(this.issue.id).deadlineAt);
      this.deadlineLimit = (this.deadline.getTime() - this.now) / 86400000;
    } else {
      this.deadline = new Date();
      this.deadlineLimit = (this.deadline.getTime() - this.now) / 86400000;
    }
    this.authQuery.user$.subscribe(user => {
      if (user.projectAdmin.includes(this.projectsId)) {
        this.isDisabledDeadline = false;
      }
    });
  }

  handleDeadlineOpenChange(open: boolean) {
    if(!open) {
      let newIssue: JIssue = { ...this.issue };
      if(this.deadline) {
        newIssue.deadlineAt = this.deadline.toLocaleString();
        this.issuesService.updateIssue(newIssue);
        this.deadlineLimit = (this.deadline.getTime() - this.now) / 86400000;
      }
    }
  }
}
