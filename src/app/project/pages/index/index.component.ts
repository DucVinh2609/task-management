import { Component, OnInit } from '@angular/core';
import { AuthQuery } from '@trungk18/project/auth/auth.query';
import { AuthService, LoginPayload } from '@trungk18/project/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(public authQuery: AuthQuery,
    private _authService: AuthService,
    private _router: Router) {
  }

  ngOnInit(): void {
    this._authService.login(new LoginPayload());
  }

  home() {
    this._router.navigate(['index']);
  }

}
