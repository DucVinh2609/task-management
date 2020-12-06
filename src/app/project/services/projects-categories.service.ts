import { Injectable } from '@angular/core';
import { JProjectCategories } from '@trungk18/interface/project';
import dummy from 'src/assets/data/project.json';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectsCategoriesService {
  projectCategory: JProjectCategories;

  constructor(private http: HttpClient) { }

  getAllCategory() {
    return this.http.get(environment.apiUrl + 'api/v1/project-category/');
  }

  getCategoryName(projectCategoriesId: number) {
    return this.http.get(environment.apiUrl + 'api/v1/project-category/' + projectCategoriesId);
  }
}
