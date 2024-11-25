import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['signup']);
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule, MatSnackBarModule, HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are filled', () => {
    component.signupForm.setValue({
      firstName: 'Luigi',
      lastName: 'Genova',
      email: 'systemasjava@gmail.com',
      birthday: '1973-08-06',
      login: 'luigigenova',
      password: '123456',
      phone: '81999991871',
    });
    expect(component.signupForm.valid).toBeTrue();
  });

  it('should call authService.signup when form is valid and submitted', () => {
    component.signupForm.setValue({
      firstName: 'Luigi',
      lastName: 'Genova',
      email: 'systemasjava@gmail.com',
      birthday: '1973-08-06',
      login: 'luigigenova',
      password: '123456',
      phone: '81999991871',
    });

    authServiceSpy.signup.and.returnValue(of({ token: 'mock-token' }));
    component.onSubmit();
    expect(authServiceSpy.signup).toHaveBeenCalled();
  });

  it('should not call authService.signup when form is invalid', () => {
    component.signupForm.setValue({
      firstName: '',
      lastName: '',
      email: '',
      birthday: '',
      login: '',
      password: '',
      phone: '',
    });

    component.onSubmit();
    expect(authServiceSpy.signup).not.toHaveBeenCalled();
  });
});
