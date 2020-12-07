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
  checkAdmin = false;

  constructor(private jobsService: JobsService,
    public authQuery: AuthQuery,
    private usersService: UsersService,
    private _modalService: NzModalService) { }

  ngOnInit(): void {
    this.usersService.getUsersById(this.currentUserId).subscribe(
      (data) => {
        if (data[0]) {
          this.currentUser = data[0];
          this.checkAdmin = this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString());
        }
      }
    )
    this.getData();
  }

  async getData() {
    if (this.listJobsId) {
      let jobsFinish = [];
      let getJobsInWorkList = this.jobsService.getJobsInWorkList(this.listJobsId).toPromise().then(
        (data: any) => {
          this.jobs = data;
        }
      )
      let getJobsInWorkListFinish = this.jobsService.getJobsInWorkListFinish(this.listJobsId).toPromise().then(
        (data: any) => {
          jobsFinish = data;
        }
      )
      await Promise.all([getJobsInWorkList, getJobsInWorkListFinish]);
      let countAll = this.jobs.length;
      let countFinish = jobsFinish.length;
      if (countAll == 0) {
        this.percent = 0;
      } else {
        this.percent =  Math.round((countFinish/countAll) * 100);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.title = this.workList.name;
    this.listJobsId = this.workList.id;
    this.issueId = this.workList.issueId;
  }

  ngAfterContentChecked() {
    // this.getData();
  }

  addJob() {
    this.checkAddJob = true;
  }

  addJobs() {
    if (this.titleJobs.trim()) {
      let job = {
        name: this.titleJobs.trim(),
        finish: false,
        userIds: '',
        deadlineAt: null,
        listJobId: this.listJobsId,
        description: null
      };

      this.jobsService.addJobs(job).subscribe(
        () => {
          this.checkAddJob = false;
          this.titleJobs = '';
          this.getData();
        }
      )
    }
  }

  // randomIdJob() {
  //   let lastId = this.jobsService.getLastIdJobInListJobs()
  //   if(lastId) {
  //     return lastId + 1;
  //   } else {
  //     return +(this.listJobsId + "0001");
  //   }
  // }

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
