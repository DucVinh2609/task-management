import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { JIssueStatus, JIssue } from '@trungk18/interface/issue';
import { FilterState } from '@trungk18/project/state/filter/filter.store';
import { ProjectService } from '@trungk18/project/state/project/project.service';
import { Observable, combineLatest, from } from 'rxjs';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { FilterQuery } from '@trungk18/project/state/filter/filter.query';
import * as dateFns from 'date-fns';
import { IssueUtil } from '@trungk18/project/utils/issue';
import { DateUtil } from '@trungk18/project/utils/date';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { UsersService } from '@trungk18/project/services/users.service';
import { JUser } from '@trungk18/interface/user';

@Component({
  selector: '[board-dnd-list]',
  templateUrl: './board-dnd-list.component.html',
  styleUrls: ['./board-dnd-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
@UntilDestroy()
export class BoardDndListComponent implements OnChanges {
  @Input() status: JIssueStatus;
  @Input() currentUserId: string;
  @Input() issues$: Observable<JIssue[]>;
  
  issues: JIssue[] = [];
  checkAddTask: boolean = false;
  titleTask: string = '';

  get issuesCount(): number {
    return this.issues.length;
  }

  get issueStatus(): number {
    return this.status.id;
  }

  get issueStatusName(): string {
    return this.status.status;
  }

  constructor(private _projectService: ProjectService,
    private _filterQuery: FilterQuery,
    public authQuery: AuthQuery,
    private issuesService: IssuesService,
    private usersService: UsersService) {
    }

  ngOnInit(): void {
    combineLatest([this.issues$, this._filterQuery.all$])
      .pipe(untilDestroyed(this))
      .subscribe(([issues, filter]) => {
        this.issues = this.filterIssues(issues, filter);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.issues = this.issuesService.getAllIssueInStatus(this.issueStatus);
  }

  drop(event: CdkDragDrop<JIssue[]>) {
    let newIssue: JIssue = { ...event.item.data };
    let newIssues = [...event.container.data];
    if (event.previousContainer === event.container) {
      moveItemInArray(newIssues, event.previousIndex, event.currentIndex);
      this.updateListPosition(newIssues);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        newIssues,
        event.previousIndex,
        event.currentIndex
      );
      this.updateListPosition(newIssues);
      newIssue.issueStatusId = event.container.id['id'];
      this.issuesService.updateIssue(newIssue);
    }
  }

  getAssigneesOfIssues(issue: JIssue) {
    let assignees: JUser[] = [];
    issue.userIds.forEach(users => {
      assignees.push(this.usersService.getUsersById(users))
    });
    return assignees;
  }

  private updateListPosition(newList: JIssue[]) {
    newList.forEach((issue, idx) => {
      let newIssueWithNewPosition = { ...issue, listPosition: idx + 1 };
      this.issuesService.updateIssue(newIssueWithNewPosition);
    });
  }

  filterIssues(issues: JIssue[], filter: FilterState): JIssue[] {
    const { onlyMyIssue, ignoreResolved, searchTerm, userIds } = filter;
    return issues.filter((issue) => {
      let isMatchTerm = searchTerm
        ? IssueUtil.searchString(issue.title, searchTerm)
        : true;

      let isIncludeUsers = userIds.length
        ? issue.userIds.some((userId) => userIds.includes(userId))
        : true;

      let isMyIssue = onlyMyIssue
        ? this.currentUserId && issue.userIds.includes(this.currentUserId)
        : true;

      let isIgnoreResolved = ignoreResolved ? issue.issueStatusId !== 4 : true;

      return isMatchTerm && isIncludeUsers && isMyIssue && isIgnoreResolved;
    });
  }

  isDateWithinThreeDaysFromNow(date: string) {
    let now = new Date();
    let inputDate = new Date(date);
    return dateFns.isAfter(inputDate, dateFns.subDays(now, 3));
  }

  addTask() {
    this.checkAddTask = true;
  }

  addTasks() {
    if (this.titleTask.trim()) {
      let now = DateUtil.getNow();
      let issue: JIssue = {
        title: this.titleTask,
        id: IssueUtil.getRandomId(),
        issueStatusId: this.issueStatus,
        createdAt: now,
        updatedAt: now,
        deadlineAt: null,
        issuePriorityId: 3,
        issueTypeId: 1,
        listPosition: this.issuesCount + 1,
        description: '',
        reporterId: this.currentUserId,
        userIds: []
      };

      this.issuesService.addIssue(issue);
      this.checkAddTask = false;
      this.titleTask = '';
    }
  }

  cancelAddTask() {
    this.checkAddTask = false;
    this.titleTask = '';
  }
}
