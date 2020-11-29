import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JUser } from '@trungk18/interface/user';
import { of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { AuthStore } from './auth.store';
import { environment } from 'src/environments/environment';
import dummy from 'src/assets/data/project.json';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl: string;
  private currentUserSubject: BehaviorSubject<JUser>
  public currentUser: Observable<JUser>;

  constructor(private _http: HttpClient,
    private _store: AuthStore) {
    this.baseUrl = environment.apiUrl;
    // this.currentUserSubject = new BehaviorSubject<JUser>(JSON.parse(localStorage.getItem('currentUser')));
    // this.currentUser = this.currentUserSubject.asObservable();
  }

  // public get currentUserValue(): JUser {
  //   return this.currentUserSubject.value;
  // }

  login({ email, password }: LoginPayload) {
    if (dummy.users.filter(u => u.email == email).length !== 0) {
      if (dummy.users.filter(u => u.email == email)[0].password === password) {
        this._store.setLoading(true);
        dummy.users.filter(u => u.email == email).map((user) => {
          this._store.update((state) => ({
            ...state,
            ...user
          }));
        }),
        finalize(() => {
          this._store.setLoading(false);
        }),
        catchError((err) => {
          this._store.setError(err);
          return of(err);
        });
        return "success";
      } else {
        return "failed";
      }
    } else {
      return "failed";
    }
  }

  // login(email: string, password: string) {
  //   let currentUser = dummy.users.filter(u => u.email == email && u.password == password)[0];
  //   localStorage.setItem('currentUser', JSON.stringify(currentUser));
  //   // this.currentUserSubject.next(currentUser);
  //   return currentUser;
  // }

  // logout() {
  //   localStorage.removeItem('currentUser');
  //   // this.currentUserSubject.next(null);
  // }
}

export class LoginPayload {
  email: string;
  password: string;
  constructor() {
    this.email = '';
    this.password = '';
  }
}
