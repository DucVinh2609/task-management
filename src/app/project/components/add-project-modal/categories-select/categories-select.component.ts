import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JProjectCategories } from '@trungk18/interface/project'
import dummy from 'src/assets/data/project.json';

@Component({
  selector: 'categories-select',
  templateUrl: './categories-select.component.html',
  styleUrls: ['./categories-select.component.scss']
})
export class CategoriesSelectComponent implements OnInit {
  @Input() control: FormControl;
  categories: JProjectCategories[] = dummy.categories;

  constructor() {}

  ngOnInit(): void {}

  getCategory(id) {
    return this.categories.filter(p => p.id === id)[0].category;
  }
}
