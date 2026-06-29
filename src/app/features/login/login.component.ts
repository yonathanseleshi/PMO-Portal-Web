import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { AuthDTO } from '../../dto/auth.dto';
import { UserRole, ROLE_LABELS } from '../../models/user-session.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  isLoading = signal(false);
  errorMessage = signal('');

  /** Demo roles offered for prototype quick sign-in. */
  readonly demoRoles: { role: UserRole; label: string }[] = [
    { role: UserRole.PMOLead, label: ROLE_LABELS[UserRole.PMOLead] },
    { role: UserRole.PMOAnalyst, label: ROLE_LABELS[UserRole.PMOAnalyst] },
    { role: UserRole.GovernanceBoard, label: ROLE_LABELS[UserRole.GovernanceBoard] },
    { role: UserRole.ProjectManager, label: ROLE_LABELS[UserRole.ProjectManager] },
  ];

  loginForm = this.fb.group({
    employeeId: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get employeeId() {
    return this.loginForm.get('employeeId');
  }

  get password() {
    return this.loginForm.get('password');
  }

  /** Production path — authenticate against the VCAuth API. */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage.set('Please fix the errors above before signing in.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const authDTO = new AuthDTO();
    authDTO.userId = this.loginForm.value.employeeId || '';
    authDTO.username = authDTO.userId;
    authDTO.password = this.loginForm.value.password || '';

    this.auth.loginWithVcAuth(authDTO).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.redirectAfterLogin();
      },
      error: (error: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Authentication failed. Please try again.');
      },
    });
  }

  /** Prototype path — sign in instantly as a demo role (no backend needed). */
  demoSignIn(role: UserRole): void {
    this.errorMessage.set('');
    this.auth.demoLogin(role).subscribe(() => this.redirectAfterLogin());
  }

  private redirectAfterLogin(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
    this.router.navigateByUrl(returnUrl);
  }
}
