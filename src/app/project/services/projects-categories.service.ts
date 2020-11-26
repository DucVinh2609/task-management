import { Injectable } from '@angular/core';
import { JProjectCategories } from '@trungk18/interface/project';
import dummy from 'src/assets/data/project.json';

@Injectable({
  providedIn: 'root'
})
export class ProjectsCategoriesService {
  projectCategory: JProjectCategories;

  constructor() { }

  getAllCategory() {
    return dummy.categories;
  }

  getCategoryName(projectCategoriesId: number) {
    return dummy.categories.filter(c => c.id === projectCategoriesId)[0].category;
  }
}
