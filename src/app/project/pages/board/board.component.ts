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
  expanded: boolean;
  constructor(private _googleAnalytics: GoogleAnalyticsService,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService) {
      this.nameProject = this.activatedRoute.snapshot.paramMap.get("nameProject");
      this.breadcrumbs = ['Projects', this.nameProject];
      this.expanded = true;
  }

  ngOnInit(): void {
    this.handleResize();
  }

  sendTwitterEventButton() {
    this._googleAnalytics.sendEvent("Share Twitter", "button")
  }

  handleResize() {
    const match = window.matchMedia('(min-width: 1024px)');
    match.addEventListener('change', (e) => {
      console.log(e)
      this.expanded = e.matches;
    });
  }

  manualToggle() {
    this.expanded = !this.expanded;
  }
}
