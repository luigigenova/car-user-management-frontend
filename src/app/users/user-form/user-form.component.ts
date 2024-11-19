import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CarService } from '../../services/car.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
    CommonModule,
    MatListModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class UserFormComponent implements OnInit {
  /** Formulário reativo */
  userForm!: FormGroup;

  /** Controle de exibição de senha */
  showPassword = false;

  /** Lista de carros disponíveis */
  availableCars: any[] = [];

  /** IDs dos carros selecionados */
  selectedCars: Set<string> = new Set();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private carService: CarService,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadAvailableCars();
  }

  /**
   * Inicializa o formulário reativo.
   */
  initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthday: ['',],
      login: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', ],
      cars: this.fb.array([]),
    });
  }

  /**
   * Carrega os carros disponíveis do serviço.
   */
  loadAvailableCars(): void {
    this.carService.getAll().subscribe((cars) => {
      this.availableCars = cars;
    });
  }

  /**
   * Verifica se um carro está selecionado.
   */
  isCarSelected(carId: string): boolean {
    return this.selectedCars.has(carId);
  }

  /**
   * Alterna a seleção de um carro.
   */
  toggleCarSelection(carId: string): void {
    if (this.selectedCars.has(carId)) {
      this.selectedCars.delete(carId);
    } else {
      this.selectedCars.add(carId);
    }
  }

  /**
   * Submete os dados do formulário.
   */
  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
  
      // Adiciona os dados completos dos carros selecionados
      userData.cars = this.availableCars.filter((car) =>
        this.selectedCars.has(car.id)
      );
  
      this.userService.createUser(userData).subscribe(
        (response) => {
          this.snackBar.open('Usuário cadastrado com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.router.navigate(['/users']);
        },
        (error) => {
          this.snackBar.open(
            `Erro ao cadastrar usuário: ${error.error?.message || 'Erro desconhecido'}`,
            'Fechar',
            { duration: 3000 }
          );
        }
      );
    } else {
      this.snackBar.open('Formulário inválido. Verifique os campos obrigatórios.', 'Fechar', {
        duration: 3000,
      });
    }
  }

  /**
   * Retorna à tela anterior.
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Alterna a visibilidade da senha.
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  applyDateMask(event: any): void {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não for número
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5, 10);
    }
    input.value = value;
  }

  applyPhoneMask(value: string): string {
    // Remove todos os caracteres que não sejam números
    let phone = value.replace(/\D/g, '');
  
    // Aplica a máscara para números com 11 dígitos: (99) 99999-9999
    if (phone.length > 10) {
      phone = phone.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    }
    // Aplica a máscara para números com 10 dígitos: (99) 9999-9999
    else if (phone.length > 6) {
      phone = phone.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    }
    // Aplica a máscara parcial para números com 2 a 6 dígitos
    else if (phone.length > 2) {
      phone = phone.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    }
    // Apenas adiciona o parêntese inicial
    else if (phone.length > 0) {
      phone = phone.replace(/^(\d{0,2})/, '($1');
    }
  
    return phone;
  }

  onPhoneInput(event: any): void {
    const input = event.target;
    input.value = this.applyPhoneMask(input.value);
  
    // Atualiza o valor do FormControl para refletir a máscara
    this.userForm.get('phone')?.setValue(input.value, { emitEvent: false });
  }
  
}