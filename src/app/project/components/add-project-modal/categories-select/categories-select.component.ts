import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JProjectCategories } from '@trungk18/interface/project';
import { ProjectsCategoriesService } from '@trungk18/project/services/projects-categories.service';

@Component({
  selector: 'categories-select',
  templateUrl: './categories-select.component.html',
  styleUrls: ['./categories-select.component.scss']
})
export class CategoriesSelectComponent implements OnInit {
  @Input() control: FormControl;
  categories: JProjectCategories[] = [];

  constructor(private projectsCategoriesService: ProjectsCategoriesService) {}

  ngOnInit(): void {
    this.projectsCategoriesService.getAllCategory().subscribe(
      (data: any) => {
        this.categories = data;
      }
    )
  }

  getCategory(id) {
    return this.categories.filter(c => c.id === id)[0].category;
  }
}
