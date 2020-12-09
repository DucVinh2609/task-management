import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectConst } from '@trungk18/project/config/const';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { JProject } from '@trungk18/interface/project';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { JIssue } from '@trungk18/interface/issue';
import { ProjectService } from '@trungk18/project/state/project/project.service';
import { DeleteIssueModel } from '@trungk18/interface/ui-model/delete-issue-model';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { ProjectsService } from '@trungk18/project/services/projects.service';

@Component({
  selector: 'full-issue-detail',
  templateUrl: './full-issue-detail.component.html',
  styleUrls: ['./full-issue-detail.component.scss']
})
@UntilDestroy()
export class FullIssueDetailComponent implements OnInit {
  project: JProject;
  issue: JIssue;
  issueById$: Observable<JIssue>;
  issueId: string;
  expanded: boolean;
  nameProject: string = '';
  projectsId: number;

  get breadcrumbs(): string[] {
    return [ProjectConst.Projects, this.nameProject, 'Issues', this.issueId];
  }

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private issuesService: IssuesService,
    private _projectQuery: ProjectQuery,
    private _projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService
  ) {
    this.nameProject = this.activatedRoute.snapshot.paramMap.get("nameProject");
    this.issueId = this.activatedRoute.snapshot.paramMap.get("issueId");
  }

  async ngOnInit() {
    let getProjectsId = this.projectsService.getProjectsId(this.nameProject).toPromise().then(
      (data) => {
        this.projectsId = data[0].id;
      }
    )
    await Promise.all([getProjectsId]);
    this.getIssue();
  }

  private getIssue() {
    this.issuesService.getInfoIssue(this.issueId).subscribe(
      (data) => {
        this.issue = data[0];
      }
    )
  }

  deleteIssue({issueId, deleteModalRef}: DeleteIssueModel) {
    this.issuesService.deleteIssue(issueId).subscribe(
      () => {
        deleteModalRef.close();
        this.backHome();
      }
    )
  }

  private backHome() {
    this._router.navigate(['/project/board/' + this.nameProject]);
  }

  manualToggle() {
    this.expanded = !this.expanded;
  }
}
