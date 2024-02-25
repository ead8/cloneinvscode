import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { streatch } from 'src/app/shared/animations/toggle-fade';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [streatch],
})
export class RegisterComponent {
  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _notifierService: NotifierService,
    private _router: Router
  ) {}

  isLoding: boolean = false;
  registerForm: FormGroup = this._formBuilder.group({
    name: [
      '',
      [Validators.required, Validators.maxLength(20), Validators.minLength(3)],
    ],
    email: [null, [Validators.required, Validators.email]],
    password: [
      null,
      [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{6,20}$/)],
    ],
    rePassword: [
      null,
      [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{6,20}$/)],
    ],
    phone: [
      null,
      [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
    ],
  });

  //^ suger syntax
  get name(): AbstractControl<any, any> | null {
    return this.registerForm.get('name');
  }
  get email(): AbstractControl<any, any> | null {
    return this.registerForm.get('email');
  }
  get password(): AbstractControl<any, any> | null {
    return this.registerForm.get('password');
  }
  get rePassword(): AbstractControl<any, any> | null {
    return this.registerForm.get('rePassword');
  }
  get phone(): AbstractControl<any, any> | null {
    return this.registerForm.get('phone');
  }
  handleForm(registerForm: FormGroup) {
    if (registerForm.valid && !this.isLoding) {
      this.isLoding = true;
      this._authService.signUp(registerForm.value).subscribe({
        next: (respons) => {
          this._notifierService.notify(
            'success',
            `${respons.message} register`
          );
          sessionStorage.setItem('email', registerForm.get('email')?.value);
          setTimeout(() => {
            this._router.navigate(['/login']);
          }, 1000);
          this.isLoding = false;
        },
        error: (er) => {
          this.isLoding = false;
          this._notifierService.notify('error', `${er.error.message}`);
        },
      });
    } else {
      registerForm.markAllAsTouched();
    }
  }
}
