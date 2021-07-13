import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Postagem } from '../model/Postagem';
import { Tema } from '../model/Temas';
import { Usuario } from '../model/Usuario';
import { PostagemService } from '../service/postagem.service';
import { TemaService } from '../service/tema.service';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertasService } from '../service/alertas.service';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url: string) {

    let regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\\-]+\?v=|embed\/|v\/))(\S+)?$/

    if (regex.test(url)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    else {
      return null;
    }


  }
}

@Component({
  selector: 'app-minhas-postagens',
  templateUrl: './minhas-postagens.component.html',
  styleUrls: ['./minhas-postagens.component.css']
})
export class MinhasPostagensComponent implements OnInit {

  nome = environment.nome

  tema: Tema = new Tema()
  listaTemas: Tema[]
  idTema: number;
  temaPostagens: Tema = new Tema()


  usuario: Usuario = new Usuario()
  user = environment.id


  idPostagem:number
  postagem: Postagem[]
  postagemUsuario: Postagem = new Postagem()

  rastrearOpcaoTema: string = "todos";

  key = 'dataDePostagem'
  reverse = true

  testeTexto: string = this.postagemUsuario.texto;

  constructor(
    private router:Router,
    private postagemService: PostagemService,
    private route: ActivatedRoute,
    private temaService: TemaService,
    private alertas: AlertasService
  ) { }

  ngOnInit() {

  /*  this.getAllPostagensDeUsuario()*/

    
   // this.findPostagemId()

   this.getAllPostagensDeUsuario()
   this.findAllTemas()

  }

  verificaPostagemTema() {

    if (this.rastrearOpcaoTema != "todos") {
      return true;
    }

    return false;

  }

  verificaPostagemGeral() {

    if (this.rastrearOpcaoTema == "todos") {
      return true;
    }

    return false;

  }

  findByIdTemaPostagens(event: any) {

    if (event.target.value != "todos") {

      this.temaService.getByIdTema(event.target.value).subscribe((resp: Tema) => {
        this.temaPostagens = resp;
      

      })}
  }

  getAllPostagensDeUsuario(){
    this.postagemService.getPostagemDeUsuario(this.user).subscribe((resp: Postagem[])=>{
      this.postagem = resp
    })

  }

  redEditPost(id: number){
    this.router.navigate(["minhas-postagens/", id]);
  }

  findPostagemId(){
    this.idPostagem = this.route.snapshot.params['id']


    this.postagemService.getPostagemById(this.idPostagem).subscribe((resp:Postagem)=>{
      this.postagemUsuario = resp

    let postagemConvertEspaco = this.postagemUsuario.texto.replace(/&nbsp;/g," ");
    let postagemConvertLinha = postagemConvertEspaco.replace(/<br>/g,"\n")
    let postagemComDestaqueUm = postagemConvertLinha.replace(/<strong>/g,"<destacar>")
    let postagemComDestaqueDois = postagemComDestaqueUm.replace(/<\/strong>/g,"</destacar>")

    this.postagemUsuario.texto = postagemComDestaqueDois

    })
  }

  findByIdTema() {
  
    this.temaService.getByIdTema(this.idTema).subscribe((resp: Tema) => {
      this.tema = resp;

    })
  }


 findAllTemas(){
   this.temaService.getTemasComuns().subscribe((resp: Tema[])=>{
     this.listaTemas = resp;
   })
 }

 verificandoVideo(url: string) {

  let regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\\-]+\?v=|embed\/|v\/))(\S+)?$/

  if (regex.test(url)) {
    return true
  }
  else {
    return false;
  }

}


 atualizar() {

  this.tema.id = this.idTema

  this.postagemUsuario.tema = this.tema

  this.usuario.id = this.user

  this.postagemUsuario.usuario = this.usuario

  this.postagemUsuario.qtCurtidas = null;

  this.postagemService.putPostagemDeUsuario(this.postagemUsuario).subscribe((resp: Postagem) => {
    this.postagemUsuario = resp


    this.alertas.showAlertSuccess('Edição feita com sucesso')

  })
}

apagar(id:number){
  this.postagemService.deletePostagem(id).subscribe(()=>{
    alert('Publicação apagada com sucesso!')
  })


}

}
