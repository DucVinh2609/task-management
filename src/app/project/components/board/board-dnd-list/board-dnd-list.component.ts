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
import { IssueStatusService } from '@trungk18/project/services/issue-status.service';
import { JUser } from '@trungk18/interface/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectsService } from '@trungk18/project/services/projects.service';
import { FormControl } from '@angular/forms';

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
  projectsId: number;
  nameProject: string = '';
  checkAdmin: boolean = false;
  statusName: string = '';
  currentUsersId: string = localStorage.getItem('token');
  currentUser: JUser;

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
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private issueStatusService: IssueStatusService) {
      this.nameProject = this.activatedRoute.snapshot.paramMap.get("nameProject");
    }

  ngOnInit(): void {
    this.usersService.getUsersById(this.currentUsersId).subscribe(
      (data) => {
        this.currentUser = data[0];
        this.issues = this.issuesService.getAllIssueInStatus(this.issueStatus);
        this.statusName = this.issueStatusName;
        this.projectsId = this.projectsService.getProjectsId(this.nameProject);
        this.checkAdmin = this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString());
      }
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.issues = this.issuesService.getAllIssueInStatus(this.issueStatus);
    const issuesConst = this.issues;
    combineLatest([this.issues$, this._filterQuery.all$])
      .pipe(untilDestroyed(this))
      .subscribe(([issues, filter]) => {
        this.issues = this.filterIssues(issuesConst, filter);
      }
    );
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
      this.usersService.getUsersById(users).subscribe(
        (data) => {
          assignees.push(data[0])
        }
      )
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
    let listIssues1: JIssue[] = [];
    let listIssues2: JIssue[] = [];
    let listIssues3: JIssue[] = [];
    let listIssues4: JIssue[] = [];
    if (userIds.length) {
      listIssues1 = this.issuesService.getIssuesOfUserInStatus(issues, userIds, this.issueStatus);
      issues = listIssues1;
    }
    if (searchTerm) {
      listIssues2 = this.issuesService.searchIssuesInStatus(issues, searchTerm, this.issueStatus);
      issues = listIssues2;
    }
    if (onlyMyIssue) {
      listIssues3 = this.issuesService.getIssuesOfCurrentUserInStatus(issues, this.currentUserId, this.issueStatus);
      issues = listIssues3;
    }
    if (ignoreResolved) {
      listIssues4 = this.issuesService.getIssuesDoneInStatus(issues, this.projectsId, this.issueStatus);
      issues = listIssues4;
    }
    if (userIds.length || searchTerm || onlyMyIssue || ignoreResolved) {
      let listIssuesFilter: JIssue[] = [];
      let listIssuesFilterResult: JIssue[] = [];
      if (userIds.length && !searchTerm && !onlyMyIssue && !ignoreResolved) {
        return listIssues1;
      } else if (!userIds.length && searchTerm && !onlyMyIssue && !ignoreResolved) {
        return listIssues2;
      } else if (!userIds.length && !searchTerm && onlyMyIssue && !ignoreResolved) {
        return listIssues3;
      } else if (!userIds.length && !searchTerm && !onlyMyIssue && ignoreResolved) {
        return listIssues4;
      } else {
        listIssuesFilter = listIssues1.concat(listIssues2, listIssues3, listIssues4).sort((a, b) => (a.listPosition > b.listPosition) ? 1 : -1);
        listIssuesFilter.filter((item, index) => {
          if (listIssuesFilter.indexOf(item) !== index) {
            listIssuesFilterResult.push(item);
          }
        });
        return [...new Set(listIssuesFilterResult)];
      }
    }
    else return this.issuesService.getAllIssueInStatus(this.issueStatus);
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

  onBlur() {
    // this.issuesService.updateIssue({
    //   ...this.issue,
    //   title: this.titleControl.value
    // });
    this.issueStatusService.updateIssueStatus({
      ...this.status,
      status: this.statusName
    });
  }
}
