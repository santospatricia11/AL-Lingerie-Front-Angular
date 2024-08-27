import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.scss'], // Corrigido o nome da propriedade de styleUrls
})
export class PostProductComponent implements OnInit {
  productForm: FormGroup;
  listOfCategories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
      imageUrl: [null, [Validators.required]], // Adicionado o campo imageUrl
    });
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.adminService.getAllCategories().subscribe((res) => {
      this.listOfCategories = res;
    });
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const productData = {
        categoryId: this.productForm.get('categoryId').value,
        name: this.productForm.get('name').value,
        description: this.productForm.get('description').value,
        price: this.productForm.get('price').value,
        imageUrl: this.productForm.get('imageUrl').value,
      };

      this.adminService.addProduct(productData).subscribe({
        next: (res) => {
          if (res.id != null) {
            this.snackbar.open('Product Posted Successfully!', 'close', {
              duration: 5000,
            });
            this.router.navigateByUrl('admin/dashboard');
          } else {
            this.snackbar.open(res.message, 'ERROR', {
              duration: 5000,
            });
          }
        },
        error: (err) => {
          this.snackbar.open('An error occurred: ' + err.message, 'ERROR', {
            duration: 5000,
          });
        },
      });
    } else {
      this.markFormControlsAsDirty();
    }
  }

  private markFormControlsAsDirty(): void {
    for (const control in this.productForm.controls) {
      if (this.productForm.controls.hasOwnProperty(control)) {
        this.productForm.controls[control].markAsDirty();
        this.productForm.controls[control].updateValueAndValidity();
      }
    }
  }
}
