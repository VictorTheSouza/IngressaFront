import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Postagem } from 'src/app/model/Postagem';
import { Tema } from 'src/app/model/Temas';
import { Usuario } from 'src/app/model/Usuario';
import { AlertasService } from 'src/app/service/alertas.service';
import { PostagemService } from 'src/app/service/postagem.service';
import { TemaService } from 'src/app/service/tema.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-postagem-edit',
  templateUrl: './postagem-edit.component.html',
  styleUrls: ['./postagem-edit.component.css']
})
export class PostagemEditComponent implements OnInit {

  postagem: Postagem = new Postagem()

  usuario: Usuario = new Usuario()
  usuarioPostagem = environment.id

  tema: Tema = new Tema()
  listaTemas: Tema[]
  idTema: number;

  constructor(
    private router: Router,
    private postagemService: PostagemService,
    private route: ActivatedRoute,
    private temaService: TemaService,
    private alertas: AlertasService
  ) { }

  ngOnInit() {

    let id = this.route.snapshot.params['id']

    this.findPostagemId(id)

    this.findAllTemas()
  }


  findPostagemId(id: number) {
    this.postagemService.getPostagemById(id).subscribe((resp: Postagem) => {
      this.postagem = resp

    })
  }

   findByIdTema() {
  
      this.temaService.getByIdTema(this.idTema).subscribe((resp: Tema) => {
        this.tema = resp;
  
      })
    }

   findAllTemas(){
     this.temaService.getAllTemas().subscribe((resp: Tema[])=>{
       this.listaTemas = resp;
     })
   }

  atualizar() {

    this.tema.id = this.idTema

    this.postagem.tema = this.tema

    this.usuario.id = this.usuarioPostagem

    this.postagem.usuario = this.usuario

    this.postagem.qtCurtidas = null;

    this.postagemService.putPostagemDeUsuario(this.postagem).subscribe((resp: Postagem) => {
      this.postagem = resp

      console.log(this.tema.id)

      this.alertas.showAlertSuccess('Edição feita com sucesso')
    })
  }

}
