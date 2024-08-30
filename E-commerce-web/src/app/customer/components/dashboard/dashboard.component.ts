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
  produtos: any[] = [];
  formularioBuscaProduto!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.obterTodosProdutos();
    this.formularioBuscaProduto = this.fb.group({
      titulo: [null, [Validators.required]],
    });
  }

  obterTodosProdutos() {
    this.produtos = [];
    this.customerService.getAllProducts().subscribe((res) => {
      console.log('Produtos recebidos:', res); // Verifique a resposta no console
      res.forEach((element: any) => {
        // Supondo que o campo que contém o link da imagem seja `imageUrl`
        element.processedImg = element.imageUrl; // Use o link direto da imagem
        this.produtos.push(element);
      });
    });
  }

  enviarFormulario() {
    this.produtos = [];
    const titulo = this.formularioBuscaProduto.get('titulo')!.value;
    this.customerService.getAllProductsByName(titulo).subscribe((res) => {
      console.log('Produtos encontrados:', res); // Verifique a resposta no console
      res.forEach((element: any) => {
        // Supondo que o campo que contém o link da imagem seja `imageUrl`
        element.processedImg = element.imageUrl; // Use o link direto da imagem
        this.produtos.push(element);
      });
    });
  }

  adicionarAoCarrinho(id: any) {
    this.customerService.addToCart(id).subscribe((res) => {
      this.snackbar.open(
        'Produto adicionado ao carrinho com sucesso!',
        'Fechar',
        {
          duration: 5000,
        }
      );
    });
  }
}
