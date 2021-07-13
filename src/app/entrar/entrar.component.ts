import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { UserLogin } from '../model/UserLogin';
import { AlertasService } from '../service/alertas.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-entrar',
  templateUrl: './entrar.component.html',
  styleUrls: ['./entrar.component.css']
})
export class EntrarComponent implements OnInit {

  userLogin: UserLogin = new UserLogin();


  constructor(
    private auth: AuthService,
    private router: Router,
    private alertas: AlertasService
  ) { }

  ngOnInit(){

    window.scroll(0,0)

  }

  logar(){

    this.auth.entrar(this.userLogin).subscribe((resp: UserLogin)=>{

      this.userLogin= resp;

      environment.id = this.userLogin.id
      environment.nome = this.userLogin.nome
      environment.token = this.userLogin.token
      environment.fotoPerfil = this.userLogin.fotoPerfil
      environment.usuarioEmpregador = this.userLogin.usuarioEmpregador


      this.router.navigate(['/inicio'])



    }, erro=>{
      if(erro.status == 500){
        this.alertas.showAlertDanger('Email ou senha incorretos')
      }
    })

  }

}
