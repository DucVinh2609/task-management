import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IssueType, JIssue, IssuePriority } from '@trungk18/interface/issue';
import { JProjectCategories, JProjectDemo } from '@trungk18/interface/project'
import { quillConfiguration } from '@trungk18/project/config/editor';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ProjectService } from '@trungk18/project/state/project/project.service';
import { IssueUtil } from '@trungk18/project/utils/issue';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { JUser } from '@trungk18/interface/user';
import { tap } from 'rxjs/operators';
import { until } from 'protractor';
import { NoWhitespaceValidator } from '@trungk18/core/validators/no-whitespace.validator';
import { DateUtil } from '@trungk18/project/utils/date';
import dummy from 'src/assets/data/project.json';

@Component({
  selector: 'add-project-modal',
  templateUrl: './add-project-modal.component.html',
  styleUrls: ['./add-project-modal.component.scss']
})
@UntilDestroy()
export class AddProjectModalComponent implements OnInit {
  reporterUsers$: Observable<JUser[]>;
  assignees$: Observable<JUser[]>;
  issueForm: FormGroup;
  editorOptions = quillConfiguration;
  priorities: JProjectCategories[] = dummy.categories;

  get f() {
    return this.issueForm?.controls;
  }

  constructor(
    private _fb: FormBuilder,
    private _modalRef: NzModalRef,
    private _projectService: ProjectService,
    public _projectQuery: ProjectQuery
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.reporterUsers$ = this._projectQuery.users$.pipe(
      untilDestroyed(this),
      tap((users) => {
        let [user] = users;
        if (user) {
          this.f.reporterId.patchValue(user.id);
        }
      })
    );

    this.assignees$ = this._projectQuery.users$;
  }

  initForm() {
    this.issueForm = this._fb.group({
      name: ['', NoWhitespaceValidator()],
      projectCategoriesId: [1],
      groupId: [0]
    });
  }

  submitForm() {
    console.log(this.issueForm.getRawValue());
    if (this.issueForm.invalid) {
      return;
    }
    let now = DateUtil.getNow();
    let newProject: JProjectDemo = {
      ...this.issueForm.getRawValue(),
      id: 2,
      createdAt: now,
      updatedAt: null,
      description: null
    };

    console.log(newProject);
    this._projectService.createProject(newProject);
    this.closeModal();
  }

  cancel() {
    this.closeModal();
  }

  closeModal() {
    this._modalRef.close();
  }
}
