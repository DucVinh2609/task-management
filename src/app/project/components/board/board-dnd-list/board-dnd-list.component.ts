import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { JIssueStatus, JIssue } from '@trungk18/interface/issue';
import { FilterState } from '@trungk18/project/state/filter/filter.store';
import { ProjectService } from '@trungk18/project/state/project/project.service';
import { Observable, combineLatest, forkJoin, from } from 'rxjs';
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
export class BoardDndListComponent implements OnInit {
  @Input() status: JIssueStatus;
  @Input() currentUserId: string;
  @Input() lastStatus: number;
  issues: JIssue[] = [];
  issuesConst: JIssue[] = [];
  checkAddTask: boolean = false;
  titleTask: string = '';
  projectsId: number;
  nameProject: string = '';
  checkAdmin: boolean = false;
  statusName: string = '';
  currentUsersId: string = localStorage.getItem('token');
  currentUser: JUser;
  load: boolean = false;

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

  async ngOnInit() {
    let getUsersById = this.usersService.getUsersById(this.currentUsersId).toPromise().then(
      (data) => {
        if (data[0]) {
          this.currentUser = data[0];
        }
      }
    );

    let getProjectsId = this.projectsService.getProjectsId(this.nameProject).toPromise().then(
      (data) => {
        this.projectsId = data[0].id;
      }
    )
    await Promise.all([getUsersById, getProjectsId]);
    let getAllIssueInStatus = this.issuesService.getAllIssueInStatus(this.issueStatus).toPromise().then(
      (data: any) => {
        // this.issues = data.sort((a, b) => (a.listPosition > b.listPosition) ? 1 : -1);
        this.issuesConst = data.sort((a, b) => (a.listPosition > b.listPosition) ? 1 : -1);
      }
    )
    await Promise.all([getAllIssueInStatus]);
    this.load = true;
    this.statusName = this.issueStatusName;
    let projectAdmin = [];
    if (this.currentUser.projectAdmin) {
      projectAdmin = this.currentUser.projectAdmin.split(',');
      this.checkAdmin = this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString());
    } else {
      this.checkAdmin = false;
    }
    this.filter();
}

  filter() {
    combineLatest([this._filterQuery.all$])
      .pipe(untilDestroyed(this))
      .subscribe(([filter]) => {
        this.issues = this.filterIssues(this.issuesConst, filter);
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
      this.issuesService.updateIssue(newIssue).subscribe(
        () => {
          this.issuesService.getAllIssueInStatus(this.issueStatus).subscribe(
            (data: any) => {
              this.issues = data.sort((a, b) => (a.listPosition > b.listPosition) ? 1 : -1);
            }
          )
        }
      );
    }
  }

  private updateListPosition(newList: JIssue[]) {
    newList.forEach((issue, idx) => {
      let newIssueWithNewPosition = { ...issue, listPosition: idx + 1 };
      this.issuesService.updateIssue(newIssueWithNewPosition).subscribe(
        () => {
          // this.issuesService.getAllIssueInStatus(this.issueStatus).subscribe(
          //   (data: any) => {
          //     this.issues = data.sort((a, b) => (a.listPosition > b.listPosition) ? 1 : -1);
          //   }
          // )
        }
      );
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
      return [...new Set(listIssues1)];
    }
    if (searchTerm) {
      listIssues2 = this.issuesService.searchIssuesInStatus(issues, searchTerm, this.issueStatus);
      return [...new Set(listIssues2)];
    }
    if (onlyMyIssue) {
      listIssues3 = this.issuesService.getIssuesOfCurrentUserInStatus(issues, this.currentUserId, this.issueStatus);
      return [...new Set(listIssues3)];
    }
    if (ignoreResolved) {
      listIssues4 = this.issuesService.getIssuesDoneInStatus(issues, this.lastStatus);
      return [...new Set(listIssues4)];
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
    else {
      return this.issuesConst;
    }
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
        updatedAt: null,
        deadlineAt: null,
        issuePriorityId: 3,
        issueTypeId: 1,
        listPosition: this.issuesCount + 1,
        description: '',
        reporterId: this.currentUserId,
        userIds: ''
      };

      this.issuesService.addIssue(issue).subscribe(
        () => {
          this.checkAddTask = false;
          this.titleTask = '';
          this.issuesService.getAllIssueInStatus(this.issueStatus).subscribe(
            (data: any) => {
              this.issues = data.sort((a, b) => (a.listPosition > b.listPosition) ? 1 : -1);
            }
          )
        }
      )
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
    }).subscribe(
      () => {}
    )
  }
}
