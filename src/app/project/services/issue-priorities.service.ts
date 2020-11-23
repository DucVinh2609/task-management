import { Injectable } from '@angular/core';
import dummy from 'src/assets/data/project.json';
import { JIssuePriorities } from 'src/app/interface/issue';

@Injectable({
  providedIn: 'root'
})
export class IssuePrioritiesService {
  priorities: JIssuePriorities;
  constructor() { }

  getIssuePriorities(id: number) {
    this.priorities = dummy.issuePriority.filter(u => u.id == id)[0];
    return this.priorities.priority;
  }
}
