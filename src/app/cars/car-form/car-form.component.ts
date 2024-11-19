import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../services/car.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

/**
 * Componente para criação e edição de carros.
 */
@Component({
  selector: 'app-car-form',
  standalone: true,
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
    CommonModule,
  ],
})
export class CarFormComponent implements OnInit {
  /**
   * Formulário reativo para entrada de dados do carro.
   */
  carForm!: FormGroup;

  /**
   * Indica se o formulário está em modo de edição.
   */
  isEditMode = false;

  /**
   * ID do carro em edição (opcional).
   */
  carId?: string;

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  /**
   * Inicializa o formulário e configura o estado do componente.
   */
  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  /**
   * Inicializa o formulário reativo com os controles necessários.
   */
  initializeForm(): void {
    this.carForm = this.fb.group({
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1886)]],
      licensePlate: ['', Validators.required],
      color: ['', Validators.required],
    });
  }

  /**
   * Verifica se o formulário está em modo de edição com base na rota.
   * Caso esteja, busca os dados do carro para preenchimento.
   */
  checkEditMode(): void {
    this.carId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.carId) {
      this.isEditMode = true;
      this.carService.getCarById(this.carId).subscribe(
        (car) => {
          this.carForm.patchValue(car); // Preenche o formulário com os dados do carro
        },
        (error) => {
          this.snackBar.open(
            `Erro ao carregar os dados do carro: ${error.error.message || 'Erro desconhecido'}`,
            'Fechar',
            { duration: 5000 }
          );
        }
      );
    }
  }

  /**
   * Submete os dados do formulário para criação ou edição de um carro.
   */
  onSubmit(): void {
    if (this.carForm.valid) {
      const carData = this.carForm.value;

      if (this.isEditMode && this.carId) {
        // Atualiza carro existente
        this.carService.updateCar(this.carId, carData).subscribe(
          () => {
            this.snackBar.open('Carro atualizado com sucesso!', 'Fechar', {
              duration: 3000,
            });
            this.router.navigate(['/cars']);
          },
          (error) => {
            this.snackBar.open(
              `Erro ao atualizar o carro: ${error.error.message || 'Erro desconhecido'}`,
              'Fechar',
              { duration: 5000 }
            );
          }
        );
      } else {
        // Cria um novo carro
        this.carService.createCar(carData).subscribe(
          () => {
            this.snackBar.open('Carro criado com sucesso!', 'Fechar', {
              duration: 3000,
            });
            this.router.navigate(['/cars']);
          },
          (error) => {
            this.snackBar.open(
              `Erro ao criar o carro: ${error.error.message || 'Erro desconhecido'}`,
              'Fechar',
              { duration: 5000 }
            );
          }
        );
      }
    } else {
      this.snackBar.open('Preencha todos os campos obrigatórios!', 'Fechar', {
        duration: 3000,
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
