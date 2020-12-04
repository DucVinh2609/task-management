import { Component, OnInit, Input } from '@angular/core';
import { JIssue } from '@trungk18/interface/issue';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { UsersService } from '@trungk18/project/services/users.service';
import { JUser } from '@trungk18/interface/user';

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
  currentUserId: string = localStorage.getItem('token');
  currentUser: JUser;

  constructor(private issuesService: IssuesService,
    private usersService: UsersService,
    public authQuery: AuthQuery) { }

  ngOnInit(): void {
    this.usersService.getUsersById(this.currentUserId).subscribe(
      (data) => {
        this.currentUser = data[0];
        if (this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString())) {
          this.isDisabledDeadline = false;
        }
      }
    )
    if(this.issuesService.getInfoIssue(this.issue.id).deadlineAt) {
      this.deadline = new Date(this.issuesService.getInfoIssue(this.issue.id).deadlineAt);
      this.deadlineLimit = (this.deadline.getTime() - this.now) / 86400000;
    } else {
      this.deadline = new Date();
      this.deadlineLimit = (this.deadline.getTime() - this.now) / 86400000;
    }
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
