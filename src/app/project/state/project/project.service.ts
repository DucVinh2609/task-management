import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { arrayRemove, arrayUpsert, setLoading } from '@datorama/akita';
import { JComment } from '@trungk18/interface/comment';
import { JIssue, JIssueTypes } from '@trungk18/interface/issue';
import { JProject, JProjects } from '@trungk18/interface/project';
import { DateUtil } from '@trungk18/project/utils/date';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProjectStore } from './project.store';
import { Router, ActivatedRoute, Params } from '@angular/router';
import dummy from 'src/assets/data/project.json'

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl: string;
  projects: JProjects[] = dummy.projects;
  issues: JIssue[] = dummy.issues;

  constructor(private _http: HttpClient,
    private _store: ProjectStore,
    private router: Router,) {
      this.baseUrl = environment.apiUrl;
  }

  setLoading(isLoading: boolean) {
    this._store.setLoading(isLoading);
  }

  getProject() {
    this._http
      .get<JProject>(`${this.baseUrl}/project.json`)
      .pipe(
        setLoading(this._store),
        tap((project) => {
          this._store.update((state) => {
            return {
              ...state,
              ...project
            };
          });
        }),
        catchError((error) => {
          this._store.setError(error);
          return of(error);
        })
      )
      .subscribe();
  }

  createProject(project: JProjects) {
    this.projects.push(project);
  }

  updateProject(project: Partial<JProject>) {
    this._store.update((state) => ({
      ...state,
      ...project
    }));
  }

  updateIssue(issue: JIssue) {
    issue.updatedAt = DateUtil.getNow();
    this._store.update((state) => {
      let issues = arrayUpsert(state.issues, issue.id, issue);
      return {
        ...state,
        issues
      };
    });
  }

  createIssue(issue: JIssue) {
    this.issues.push(issue);
  }

  deleteIssue(issueId: string) {
    this._store.update((state) => {
      let issues = arrayRemove(state.issues, issueId);
      return {
        ...state,
        issues
      };
    });
  }

  updateIssueComment(issueId: string, comment: JComment) {
    let allIssues = this._store.getValue().issues;
    let issue = allIssues.find((x) => x.id === issueId);
    if (!issue) {
      return;
    }

    // let comments = arrayUpsert(issue.comments ?? [], comment.id, comment);
    // this.updateIssue({
    //   ...issue,
    //   comments
    // });
  }

  getProjectId(nameProject: string) {
    if (this.projects.filter(p => p.name === nameProject).length !== 0) {
      return this.projects.filter(p => p.name === nameProject)[0].id;
    } else {
      this.router.navigate(['/error'])
    }
  }
}
