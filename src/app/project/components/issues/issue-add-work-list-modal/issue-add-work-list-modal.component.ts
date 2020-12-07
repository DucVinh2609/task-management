import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NoWhitespaceValidator } from '@trungk18/core/validators/no-whitespace.validator';
import { ListJobsService } from '@trungk18/project/services/list-jobs.service';

@Component({
  selector: 'issue-add-work-list-modal',
  templateUrl: './issue-add-work-list-modal.component.html',
  styleUrls: ['./issue-add-work-list-modal.component.scss']
})
export class IssueAddWorkListModalComponent implements OnInit {
  issueId: string;
  titleWorkList: string = '';
  addWorkListForm: FormGroup;

  constructor(private _modalRef: NzModalRef,
    private _fb: FormBuilder,
    private listJobsService: ListJobsService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.addWorkListForm = this._fb.group({
      titleWorkList: ['', NoWhitespaceValidator()]
    });
  }

  async addWorkList() {
    let newWorkList = {
      id: 0,
      name: this.addWorkListForm.get('titleWorkList').value,
      issueId: this.issueId
    }
    let getAllId = this.listJobsService.getAllId().toPromise().then(
      (data: any) => {
        if (data.length > 0) {
          newWorkList.id = data.sort((a, b) => (a.id < b.id) ? 1 : -1)[0].id + 1;
        } else {
          newWorkList.id = 1;
        }
      }
    )
    await Promise.all([getAllId]);

    this.listJobsService.addListJobs(newWorkList).subscribe(
      () => {
        this._modalRef.close();
      }
    )
  }

  closeModal() {
    this._modalRef.close();
  }
}
