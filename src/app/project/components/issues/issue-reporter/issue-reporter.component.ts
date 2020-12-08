import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { JIssue } from '@trungk18/interface/issue';
import { JUser } from '@trungk18/interface/user';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { UsersService } from '@trungk18/project/services/users.service';

@Component({
  selector: 'issue-reporter',
  templateUrl: './issue-reporter.component.html',
  styleUrls: ['./issue-reporter.component.scss']
})
@UntilDestroy()
export class IssueReporterComponent implements OnInit, OnChanges {
  @Input() issue: JIssue;
  reporter: JUser;

  constructor(private issuesService: IssuesService,
    private usersService: UsersService) {}

  async ngOnInit() {
    let reporterId = '';
    let getInfoIssue = this.issuesService.getInfoIssue(this.issue.id).toPromise().then(
      (data) => {
        reporterId = data[0].reporterId;
      }
    )
    await Promise.all([getInfoIssue]);
    this.usersService.getUsersById(reporterId).subscribe(
      (data) => {
        if (data[0]) {
          this.reporter = data[0];
        }
      }
    )
  }

  ngOnChanges(changes: SimpleChanges) {
  }
}
