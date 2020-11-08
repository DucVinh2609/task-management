import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '@trungk18/core/services/google-analytics.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  breadcrumbs: string[] = [];

  constructor(private _googleAnalytics: GoogleAnalyticsService,
    private activatedRoute: ActivatedRoute) {
      let nameProject = this.activatedRoute.snapshot.paramMap.get("nameProject");
      this.breadcrumbs = ['Projects', nameProject]
  }

  ngOnInit(): void {}

  sendTwitterEventButton() {
    this._googleAnalytics.sendEvent("Share Twitter", "button")
  }
}
