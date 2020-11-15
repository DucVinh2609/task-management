import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { JListJobs } from '@trungk18/interface/list-job';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'issue-work-list',
  templateUrl: './issue-work-list.component.html',
  styleUrls: ['./issue-work-list.component.scss']
})
@UntilDestroy()
export class IssueWorkListComponent implements OnChanges {
  @Input() workList: JListJobs;
  title: string = '';
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 50;
  bufferValue = 75;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.title = this.workList.name;
    console.log(this.workList);
  }
}
