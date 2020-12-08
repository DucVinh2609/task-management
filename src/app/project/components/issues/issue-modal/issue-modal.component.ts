import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JIssue } from '@trungk18/interface/issue';
import { ProjectService } from '@trungk18/project/state/project/project.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { DeleteIssueModel } from '@trungk18/interface/ui-model/delete-issue-model';
import { IssuesService } from '@trungk18/project/services/issues.service';

@Component({
  selector: 'issue-modal',
  templateUrl: './issue-modal.component.html',
  styleUrls: ['./issue-modal.component.scss']
})
export class IssueModalComponent implements OnInit {
  @Input() issue: JIssue;
  @Input() projectsId: number;

  constructor(
    private _modal: NzModalRef,
    private issuesService: IssuesService,
    private _router: Router,
    private _projectService: ProjectService
  ) {}

  ngOnInit(): void {
  }

  closeModal() {
    this._modal.close();
  }

  openIssuePage(issueId: string) {
    this.closeModal();
    this._router.navigate(['project', 'issue', issueId]);
  }

  deleteIssue({ issueId, deleteModalRef }: DeleteIssueModel) {
    this.issuesService.deleteIssue(issueId).subscribe(
      () => {
        deleteModalRef.close();
        this.closeModal();
      }
    )
  }
}
