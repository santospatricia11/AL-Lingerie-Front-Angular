import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  searchProductForm!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getAllProducts();
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]],
    });
  }

  getAllProducts() {
    this.products = [];
    this.customerService.getAllProducts().subscribe((res) => {
      res.forEach((element) => {
        element.processedImg = '' + element.byteImg;
        this.products.push(element);
      });
    });
  }

  submitForm() {
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;
    this.customerService.getAllProductsByName(title).subscribe((res) => {
      res.forEach((element) => {
        element.processedImg = '' + element.byteImg;
        this.products.push(element);
      });
    });
  }

  addToCart(productId: number) {
    this.customerService.addToCart(productId).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
        // Atualizar a UI para refletir o sucesso
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error details:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        
        if (error.status === 409) {
          alert('Produto já está no carrinho.');
        } else {
          alert('Erro ao adicionar o produto ao carrinho.');
        }
      },
    });
  }
  
}
