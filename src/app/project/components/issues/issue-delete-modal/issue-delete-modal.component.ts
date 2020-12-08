import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DeleteIssueModel } from '@trungk18/interface/ui-model/delete-issue-model';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { ListJobsService } from '@trungk18/project/services/list-jobs.service';
import { JobsService } from '@trungk18/project/services/jobs.service';

@Component({
  selector: 'issue-delete-modal',
  templateUrl: './issue-delete-modal.component.html',
  styleUrls: ['./issue-delete-modal.component.scss']
})
export class IssueDeleteModalComponent implements OnInit {
  data: any;
  title: string;
  delete: string;
  onDelete = new EventEmitter<DeleteIssueModel>();

  constructor(private _modalRef: NzModalRef,
    private issuesService: IssuesService,
    private listJobsService: ListJobsService,
    private jobsService: JobsService) {}

  ngOnInit(): void {}

  async deleteIssue() {
    if (this.delete === "issue") {
      this.issuesService.deleteIssue(this.data).subscribe(
        () => {
          this.onDelete.emit(new DeleteIssueModel(this.data, this._modalRef));
        }
      )
    } else if (this.delete === "worklist") {
      let jobs = [];
      let getJobsInWorkList = this.jobsService.getJobsInWorkList(this.data).toPromise().then(
        (data: any) => {
          console.log(data);
          jobs = data;
        }
      )
      await Promise.all([getJobsInWorkList]);
      console.log(jobs);
      for (let i = 0; i < jobs.length; i++) {
        console.log(jobs[i]);
        let getIssueIdByListJobsId = this.jobsService.deleteJobs(jobs[i].id).toPromise().then(
          () => { }
        )
        await Promise.all([getIssueIdByListJobsId]);
      }

      this.listJobsService.deleteListJobs(this.data).subscribe(
        () => {
          this._modalRef.close();
        }
      )
    } else if (this.delete === "jobs") {
      this.jobsService.deleteJobs(this.data).subscribe(
        () => {
          this._modalRef.close();
        }
      )
    }
  }

  closeModal() {
    this._modalRef.close();
  }
}
