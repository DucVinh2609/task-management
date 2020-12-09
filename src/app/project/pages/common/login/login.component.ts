import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, LoginPayload } from '@trungk18/project/auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  error: boolean = false;

  constructor(private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    let loginPayload: LoginPayload;
    loginPayload = {
      email: this.validateForm.get('email').value,
      password: this.validateForm.get('password').value
    }

    this._authService.getToken(loginPayload).subscribe(
      (data) => {
        localStorage.setItem('isLoggedIn', "true");
        localStorage.setItem('token', data[0].id);
        this.router.navigateByUrl('index');
      },
      () => {
        this.error = true;
      }
    )
  }

  register() {
    window.location.href = '/registration';
  }
}
