import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { JIssueStatus } from '@trungk18/interface/issue';
import { ProjectQuery } from '@trungk18/project/state/project/project.query';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import dummy from 'src/assets/data/project.json';

@UntilDestroy()
@Component({
  selector: 'board-dnd',
  templateUrl: './board-dnd.component.html',
  styleUrls: ['./board-dnd.component.scss']
})
export class BoardDndComponent implements OnInit {
  issueStatuses: JIssueStatus[] = dummy.status.sort((a, b) => (a.position > b.position) ? 1 : -1);
  checkAddDndList: boolean = false;
  titleListTask: string = '';

  constructor(public projectQuery: ProjectQuery, public authQuery: AuthQuery) {}

  ngOnInit(): void {}

  addDndList() {
    this.checkAddDndList = true;
  }

  addListTask() {
    let newListTask: JIssueStatus = {
      "id": 5,
      "position": 4,
      "status": this.titleListTask,
      "projectId": 1
    }
    this.issueStatuses.push(newListTask);
    this.checkAddDndList = false;
    this.titleListTask = '';
  }

  cancelAddListTask() {
    this.checkAddDndList = false;
    this.titleListTask = '';
  }
}
