import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '@trungk18/core/services/google-analytics.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '@trungk18/project/state/project/project.service';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  breadcrumbs: string[] = [];
  nameProject: string = '';
  constructor(private _googleAnalytics: GoogleAnalyticsService,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService) {
      this.nameProject = this.activatedRoute.snapshot.paramMap.get("nameProject");
      this.breadcrumbs = ['Projects', this.nameProject]
      console.log(projectService.getProjectId(this.nameProject));
  }

  ngOnInit(): void {}

  sendTwitterEventButton() {
    this._googleAnalytics.sendEvent("Share Twitter", "button")
  }
}
