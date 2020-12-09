import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JIssue } from '@trungk18/interface/issue';
import { ProjectService } from '@trungk18/project/state/project/project.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { DeleteIssueModel } from '@trungk18/interface/ui-model/delete-issue-model';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { ProjectsService } from '@trungk18/project/services/projects.service';

@Component({
  selector: 'issue-modal',
  templateUrl: './issue-modal.component.html',
  styleUrls: ['./issue-modal.component.scss']
})
export class IssueModalComponent implements OnInit {
  @Input() issue: JIssue;
  @Input() nameProject: string;
  projectsId: number;
  load: boolean = false;

  constructor(
    private _modal: NzModalRef,
    private issuesService: IssuesService,
    private _router: Router,
    private _projectService: ProjectService,
    protected projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.projectsService.getProjectsId(this.nameProject).subscribe(
      (data) => {
        this.projectsId = data[0].id;
        this.load = true;
      }
    )
  }

  closeModal() {
    this._modal.close();
  }

  openIssuePage(issueId: string) {
    this.closeModal();
    this._router.navigate(['project', 'issue', this.nameProject, issueId]);
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
