import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IssuePriorityIcon } from '@trungk18/interface/issue-priority-icon';
import { IssueUtil } from '@trungk18/project/utils/issue';
// import { IssuePriority } from '@trungk18/interface/issue';
import { ProjectConst } from '@trungk18/project/config/const';
import { IssuePrioritiesService } from '@trungk18/project/services/issue-priorities.service';

@Component({
  selector: 'issue-priority-select',
  templateUrl: './issue-priority-select.component.html',
  styleUrls: ['./issue-priority-select.component.scss']
})
export class IssuePrioritySelectComponent implements OnInit {
  @Input() control: FormControl;
  priorities: IssuePriorityIcon[];
  listIssuePriorities: any[] = [];
  load: boolean = false;

  constructor(private issuePrioritiesService: IssuePrioritiesService) {
    this.priorities = ProjectConst.PrioritiesWithIcon;

    this.issuePrioritiesService.getAllIssuePriorities().subscribe(
      (data: any) => {
        this.listIssuePriorities = data;
        this.load = true;
      }
    )
  }

  getPriorityIcon(priority) {
    return IssueUtil.getIssuePriorityIcon(priority);
  }

  getIssuePriorities(issuePrioritiesId) {
    return this.listIssuePriorities.filter(p => p.id == issuePrioritiesId)[0].priority;
  }

  ngOnInit(): void {}
}
