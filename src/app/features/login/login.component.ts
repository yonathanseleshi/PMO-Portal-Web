import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PmoMockService } from '../../core/services/pmo-mock.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private pmoService = inject(PmoMockService);
  private router = inject(Router);

  loginForm = new FormGroup({
    employeeId: new FormControl('', [
      Validators.required,
      Validators.pattern(/^VC\d{4,6}$|^[a-zA-Z0-9_\-.]{3,20}$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    role: new FormControl<'pmo' | 'pm'>('pmo', [Validators.required])
  });

  errorMessage = '';

  constructor() {}

  get employeeId() {
    return this.loginForm.get('employeeId');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get role() {
    return this.loginForm.get('role');
  }

  prepopulate(role: 'pmo' | 'pm') {
    if (role === 'pmo') {
      this.loginForm.patchValue({
        employeeId: 'VC2061',
        password: 'pmoPassword123',
        role: 'pmo'
      });
    } else {
      this.loginForm.patchValue({
        employeeId: 'VC4192',
        password: 'pmPassword123',
        role: 'pm'
      });
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please fix the errors in the form above.';
      return;
    }

    const employeeId = this.loginForm.value.employeeId || '';
    const selectedRole = this.loginForm.value.role || 'pmo';

    // Store login status and role in mock service
    this.pmoService.login(employeeId, selectedRole);

    // Navigate to dashboard
    this.router.navigate(['/dashboard']);
  }
}
