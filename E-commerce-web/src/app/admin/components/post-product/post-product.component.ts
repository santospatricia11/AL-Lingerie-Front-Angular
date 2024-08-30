import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.scss'],
})
export class PostProductComponent implements OnInit {
  productForm: FormGroup;
  listOfCategories: any[] = [];
  imagePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private adminService: AdminService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
      imageUrl: [null, [Validators.required]], // Campo para link da imagem
    });
    this.getAllCategories();
    this.loadProductDetails();
  }

  getAllCategories(): void {
    this.adminService.getAllCategories().subscribe((res) => {
      this.listOfCategories = res;
    });
  }

  loadProductDetails(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.adminService.getProductById(productId).subscribe((product) => {
        this.productForm.patchValue(product);
        this.imagePreviewUrl = product.imageUrl; // Atualizar a URL da imagem
      });
    }
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;

      // Enviar o link da imagem diretamente
      this.adminService.addProduct(productData).subscribe({
        next: (res) => {
          if (res.id != null) {
            this.snackbar.open('Produto adicionado com sucesso!', 'Fechar', {
              duration: 5000,
            });
            this.router.navigateByUrl('admin/dashboard');
          } else {
            this.snackbar.open(res.message, 'ERRO', {
              duration: 5000,
            });
          }
        },
        error: (err) => {
          this.snackbar.open('Ocorreu um erro: ' + err.message, 'ERRO', {
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
