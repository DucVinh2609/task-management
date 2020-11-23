import { Injectable } from '@angular/core';
import { JIssueTypes } from '@trungk18/interface/issue';
import dummy from 'src/assets/data/project.json';

@Injectable({
  providedIn: 'root'
})
export class IssueTypesService {
  types: JIssueTypes;

  constructor() { }

  getTypesName(typeId: number) {
    this.types = dummy.issueType.filter(u => u.id == typeId)[0];
    if (this.types) {
      return this.types.type
    }
  }
}
