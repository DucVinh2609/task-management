import { ProjectState, ProjectStore } from './project.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { JIssue } from '@trungk18/interface/issue';
import { filter, map, delay } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import dummy from 'src/assets/data/project.json';

@Injectable({
  providedIn: 'root'
})
export class ProjectQuery extends Query<ProjectState> {
  constructor(protected store: ProjectStore) {
    super(store);
  }
  isLoading$ = this.selectLoading();
  all$ = this.select();
  issues$ = this.select('issues');
  users$ = this.select('users');

  lastIssuePosition = (status: number): number => {
    let raw = this.store.getValue();
    let issuesByStatus = raw.issues.filter(x => x.issueStatusId === status);
    return issuesByStatus.length;
  }

  issueByStatusSorted$ = (status: number): Observable<JIssue[]> => {
    const issues: JIssue[] = dummy.issues
      .filter(i => i.issueStatusId === status)
      .sort((a, b) => a.listPosition - b.listPosition);
    
    return of(issues);
    // return this.issues$.pipe(
    //   map((issues) => {
    //     let filteredIssues = issues
    //       .filter((x) => x.issueStatusId === status)
    //       .sort((a, b) => a.listPosition - b.listPosition);
    //     return filteredIssues;
    //   })
    // );
  };

  issueById$(issueId: string){
    return this.issues$.pipe(
      delay(500),
      map((issues) => {
        let issue = issues.find(x => x.id === issueId);
        return issue;
      })
    )
  }
}
