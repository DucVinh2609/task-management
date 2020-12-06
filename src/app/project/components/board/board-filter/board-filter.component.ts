import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FilterQuery } from '@trungk18/project/state/filter/filter.query';
import { FilterService } from '@trungk18/project/state/filter/filter.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { JUser } from '@trungk18/interface/user';
import { UsersService } from 'src/app/project/services/users.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectsService } from '@trungk18/project/services/projects.service';
import { InviteMemberModalComponent } from '@trungk18/project/components/invite-member-modal/invite-member-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'board-filter',
  templateUrl: './board-filter.component.html',
  styleUrls: ['./board-filter.component.scss']
})
@UntilDestroy()
export class BoardFilterComponent implements OnInit {
  searchControl: FormControl = new FormControl("");
  userIds: string[];
  listUsersInProjects: any;
  nameProject: string = '';
  projectsId: number;

  constructor(
    public projectQuery: ProjectQuery,
    public filterQuery: FilterQuery,
    private _modalService: NzModalService,
    public filterService: FilterService,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private projectsService: ProjectsService
  ) {
    this.userIds = [];
    this.nameProject = this.activatedRoute.snapshot.paramMap.get("nameProject");
  }

  async ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(100), distinctUntilChanged(), untilDestroyed(this))
      .subscribe((term) => {
        this.filterService.updateSearchTerm(term);
      });

    this.filterQuery.userIds$.pipe(untilDestroyed(this)).subscribe((userIds) => {
      this.userIds = userIds;
    });

    let getProjectsId = this.projectsService.getProjectsId(this.nameProject).toPromise().then(
      (data) => {
        this.projectsId = data[0].id;
      }
    )

    await Promise.all([getProjectsId]);

    this.usersService.getUsersInProjects(this.projectsId).subscribe (
      (data) => {
        this.listUsersInProjects = data;
      }
    )
  }

  isUserSelected(user: JUser) {
    return this.userIds.includes(user.id);
  }

  ignoreResolvedChanged() {
    this.filterService.toggleIgnoreResolve();
  }

  onlyMyIssueChanged() {
    this.filterService.toggleOnlyMyIssue();
  }

  userChanged(user: JUser) {
    this.filterService.toggleUserId(user.id);
  }

  resetAll() {
    this.searchControl.setValue('');
    this.filterService.resetAll();
  }

  inviteMember() {
    const modalRef = this._modalService.create({
      nzContent: InviteMemberModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 500,
      nzComponentParams: {
        projectsId: this.projectsId
      }
    });
    modalRef.afterClose.subscribe(() => {
      this.usersService.getUsersInProjects(this.projectsId).subscribe (
      (data) => {
        this.listUsersInProjects = data;
      }
    )
      // if (result.result == 'error') {

      // } else if (result.result == 'success') {
      //   this.listUsersInProjects = this.usersService.getUsersInProjects(this.projectsId);
      // }
    });
  }
}
