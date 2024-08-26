import { Component } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrl: './post-product.component.scss'
})
export class PostProductComponent {
  productForm: FormGroup;
  listOfCategories: any=[];
  selectedFile: File | null;
  imagepreview: string | ArrayBuffer | null;

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private snackbar:MatSnackBar,
    private adminService: AdminService
  ){}

  onFileSelected(event: any){
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage(){
    const reader = new FileReader();
    reader.onload=()=>{
      this.imagepreview= reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
  }

  ngOnInit():void{
    this.productForm = this.fb.group({
      categoryId :[null,[Validators.required]],
      name :[null,[Validators.required]],
      price :[null,[Validators.required]],
      description :[null,[Validators.required]],
    });
    this.getAllCategories();
  }

  getAllCategories(){
    this.adminService.getAllCategories().subscribe(res=>{
      this.listOfCategories = res;
    })
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const formData: FormData = new FormData();

      // Anexando os dados do produto ao formData como JSON
      const productData = {
        categoryId: this.productForm.get('categoryId').value,
        name: this.productForm.get('name').value,
        description: this.productForm.get('description').value,
        price: this.productForm.get('price').value,
        // Outros campos se necessário
      };

      formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

      // Anexando o arquivo
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      // Fazendo a requisição
      this.adminService.addProduct(formData).subscribe({
        next: (res) => {
          if (res.id != null) {
            this.snackbar.open('Product Posted Successfully!', 'close', {
              duration: 5000
            });
            this.router.navigateByUrl('admin/dashboard');
          } else {
            this.snackbar.open(res.message, 'ERROR', {
              duration: 5000
            });
          }
        },
        error: (err) => {
          this.snackbar.open('An error occurred: ' + err.message, 'ERROR', {
            duration: 5000
          });
        }
      });
    } else {
      for (const i in this.productForm.controls) {
        if (this.productForm.controls.hasOwnProperty(i)) {
          this.productForm.controls[i].markAsDirty();
          this.productForm.controls[i].updateValueAndValidity();
        }
      }
    }
  }



}
