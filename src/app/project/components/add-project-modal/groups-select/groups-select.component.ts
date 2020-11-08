import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JGroups } from '@trungk18/interface/group'
import dummy from 'src/assets/data/project.json';

@Component({
  selector: 'groups-select',
  templateUrl: './groups-select.component.html',
  styleUrls: ['./groups-select.component.scss']
})
export class GroupsSelectComponent implements OnInit {
  @Input() control: FormControl;
  groups: JGroups[] = dummy.groups;

  constructor() {
    this.groups.unshift({
      "id": 0,
      "name": "No Groups",
      "userIds": [],
      "description": "",
      "createdAt": null,
      "updateAt": null
    });
  }

  ngOnInit(): void {}

  getNameGroup(id) {
    return this.groups.filter(p => p.id === id)[0].name;
  }
}
