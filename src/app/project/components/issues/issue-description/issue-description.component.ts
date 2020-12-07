import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { JIssue } from '@trungk18/interface/issue';
import { FormControl } from '@angular/forms';
import { quillConfiguration } from '@trungk18/project/config/editor';
import { ProjectService } from '@trungk18/project/state/project/project.service';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { IssuesService } from '@trungk18/project/services/issues.service';
import { UsersService } from '@trungk18/project/services/users.service';
import { JUser } from '@trungk18/interface/user';

@Component({
  selector: 'issue-description',
  templateUrl: './issue-description.component.html',
  styleUrls: ['./issue-description.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IssueDescriptionComponent implements OnChanges {
  @Input() issue: JIssue;
  @Input() projectsId: number;
  descriptionControl: FormControl;
  editorOptions = quillConfiguration;
  isEditing: boolean;
  isWorking: boolean;
  currentUserId: string = localStorage.getItem('token');
  currentUser: JUser;

  constructor(private _projectService: ProjectService,
    public authQuery: AuthQuery,
    private usersService: UsersService,
    private issuesService: IssuesService) {
      this.usersService.getUsersById(this.currentUserId).subscribe(
        (data) => {
          if (data[0]) {
            this.currentUser = data[0];
          }
        }
      )
    }

  ngOnChanges(changes: SimpleChanges): void {
    let issueChange = changes.issue;
    if (issueChange.currentValue !== issueChange.previousValue) {
      this.descriptionControl = new FormControl(this.issue.description);
    }
  }

  setEditMode() {
    if (this.currentUser.projectAdmin.split(',').includes(this.projectsId.toString())) {
      this.isEditing = true;
    }
  }

  editorCreated(editor: any) {
    editor.focus && editor.focus();
  }

  save() {
    this.issuesService.updateIssue({
      ...this.issue,
      description: this.descriptionControl.value
    });
    this.isEditing = false;
  }

  cancel() {
    this.descriptionControl.patchValue(this.issue.description);
    this.isEditing = false;
  }

  ngOnInit(): void {}
}
