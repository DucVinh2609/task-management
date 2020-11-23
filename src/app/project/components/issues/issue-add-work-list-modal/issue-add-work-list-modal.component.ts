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

  addWorkList() {
    this.listJobsService.addListJobs(this.addWorkListForm.get('titleWorkList').value, this.issueId)
    this._modalRef.close();
  }

  closeModal() {
    this._modalRef.close();
  }
}
