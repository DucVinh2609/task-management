import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { JListJobs } from '@trungk18/interface/list-job';
import { IssueDeleteModalComponent } from '../issue-delete-modal/issue-delete-modal.component';
import { JJobs } from '@trungk18/interface/job';
import { JobsService } from '@trungk18/project/services/jobs.service';
import { JUser } from '@trungk18/interface/user';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { UsersService } from '@trungk18/project/services/users.service';

@Component({
  selector: 'issue-work-list',
  templateUrl: './issue-work-list.component.html',
  styleUrls: ['./issue-work-list.component.scss']
})
@UntilDestroy()
export class IssueWorkListComponent implements OnChanges {
  @Input() workList: JListJobs;
  @Input() users: JUser[];
  @Input() projectsId: number;
  title: string = '';
  listJobsId: number;
  issueId: string = '';
  checkAddJob: boolean = false;
  titleJobs: string = '';
  percent = 0;
  jobs: JJobs[] = [];
  currentUserId: string = localStorage.getItem('token');
  currentUser: JUser;

  constructor(private jobsService: JobsService,
    public authQuery: AuthQuery,
    private usersService: UsersService,
    private _modalService: NzModalService) { }

  ngOnInit(): void {
    this.currentUser = this.usersService.getUsersById(this.currentUserId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.title = this.workList.name;
    this.listJobsId = this.workList.id;
    this.issueId = this.workList.issueId;
  }

  ngAfterContentChecked() {
    if (this.listJobsId) {
      this.jobs = this.jobsService.getJobsInWorkList(this.listJobsId);
      this.percent = this.jobsService.getPercentOfWorkList(this.listJobsId);
    }
  }

  addJob() {
    this.checkAddJob = true;
  }

  addJobs() {
    if (this.titleJobs.trim()) {
      let job: JJobs = {
        id: this.randomIdJob(),
        name: this.titleJobs.trim(),
        issueId: this.issueId,
        finish: false,
        userIds: null,
        deadlineAt: null,
        listJobsId: this.listJobsId,
        description: null
      };

      this.jobsService.addJobs(job);
      this.checkAddJob = false;
      this.titleJobs = '';
    }
  }

  randomIdJob() {
    let lastId = this.jobsService.getLastIdJobInListJobs()
    if(lastId) {
      return lastId + 1;
    } else {
      return +(this.listJobsId + "0001");
    }
  }

  cancelAddJob() {
    this.checkAddJob = false;
    this.titleJobs = '';
  }

  deleteWorkList() {
    this._modalService.create({
      nzContent: IssueDeleteModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzStyle: {
        top: "140px"
      },
      nzComponentParams: {
        title: "Are you sure you want to delete this work list?",
        data: this.workList.id,
        onDelete: null,
        delete: "worklist"
      }      
    });
  }
}
