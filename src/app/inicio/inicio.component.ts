import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Postagem } from '../model/Postagem';
import { Tema } from '../model/Temas';
import { Usuario } from '../model/Usuario';
import { AuthService } from '../service/auth.service';
import { InicioService } from '../service/inicio.service';
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
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  nome = environment.nome

  foto = environment.fotoPerfil

  postagens: Postagem[]

  postagensEmAlta: Postagem[]

  temas: Tema[]

  postagem: Postagem = new Postagem()

  postagem2: Postagem = new Postagem()

  temaEscolhido: number;

  tema: Tema = new Tema()

  usuario: Usuario = new Usuario()

  usuario2: Usuario = new Usuario()

  postagemCurtida: Postagem = new Postagem()

  user = environment.id

  urlVideo: string;

  temaPostagens: Tema = new Tema();

  rastrearOpcaoTema: string = "todos";

  key = 'dataDePostagem'
  reverse = true

  postagensCurtidasUser: Postagem[]


  constructor(
    private router: Router,
    private postagemService: PostagemService,
    private temaService: TemaService,
    private authService: AuthService,
    private alertas: AlertasService
  ) { }

  ngOnInit() {

    window.scroll(0,0)

       if(environment.token == ''){
         alert('Sessão expirada, faça login novamente')
         this.router.navigate(['/entrar'])
   
   
       }

    this.findPostagensComuns()

    this.findPostagensEmAlta()

    this.getAllTemasComuns()

    this.findByUser()

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


  findPostagensComuns() {

    this.postagemService.getAllPostagensComuns().subscribe((resp: Postagem[]) => {
      this.postagens = resp;



    })
  }


  findByIdTema() {

    this.temaService.getByIdTema(this.temaEscolhido).subscribe((resp: Tema) => {
      this.tema = resp;

    })
  }


  findByIdTemaPostagens(event: any) {

    if (event.target.value != "todos") {

      this.temaService.getByIdTema(event.target.value).subscribe((resp: Tema) => {
        this.temaPostagens = resp;
      

      })}
  }


  getAllTemasComuns() {
    this.temaService.getTemasComuns().subscribe((resp: Tema[]) => {
      this.temas = resp
    })
  }


  PostPostagensComum() {

    let regex = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/

    if (regex.test(this.postagem.midia)) {

      const regex = /(?:.+)(?:\.be\/|v=)(.+?)(?:&|$)(?:t=)?(.+)?/gm
      const subst = `$1`;

      let url = this.postagem.midia

      let idVideo = url.replace(regex, subst);

      this.postagem.midia = "https://www.youtube.com/embed/" + idVideo;

    }

    this.usuario.id = this.user

    this.postagem.usuario = this.usuario

    this.tema.id = this.temaEscolhido

    this.postagem.tema = this.tema

    this.postagemService.postPostagem(this.postagem).subscribe((resp: Postagem) => {
      this.postagem = resp;


      alert('Postagem realizada com sucesso')
      this.findPostagensComuns()
      this.postagem = new Postagem()
      this.router.navigate(['/inicio'])
    })
  }


  findPostagensEmAlta() {
    this.postagemService.getPostagensEmAlta().subscribe((resp: Postagem[]) => {
      this.postagensEmAlta = resp;
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

  curtidaPostagem(idUserCurtida: number, idPostagemCurtida: number){
    this.authService.curtirPostagem(idUserCurtida, idPostagemCurtida).subscribe((resp: Usuario)=>{
      this.usuario = resp;
      this.findByUser()
    })
  }

  descurtidaPostagem(idUserCurtida: number, idPostagemCurtida: number){
    this.authService.descurtirPostagem(idUserCurtida, idPostagemCurtida).subscribe((resp: Usuario)=>{
      this.usuario = resp;
      this.findByUser()
    })
  }

  findByUser(){
    this.authService.getByIdUsuario(environment.id).subscribe((resp: Usuario)=>{
      this.usuario2 = resp;
    this.postagensCurtidasUser = this.usuario2.postagemCurtidas;
    })
  }

  verificandoCurtidasFeita(id: number){

    if(this.postagensCurtidasUser == null){
      return false;
    }
    else if(this.postagensCurtidasUser.length == 0){
      return false;
    }

    this.postagemCurtida = this.postagensCurtidasUser.find(myObj => myObj.id == id)

    if(this.postagemCurtida.id == id){
      return true
    }

   return false;

  }

  verificandoCurtidasNaoFeita(id: number){
    if(this.postagensCurtidasUser == null){
      return true;
    }
    else if(this.postagensCurtidasUser.length == 0){
      return true;
    }

    this.postagemCurtida = this.postagensCurtidasUser.find(myObj => myObj.id == id)

    if(this.postagemCurtida.id != id){
      return true
    }

   return false;
  }



 contClickCurtida(id: number){
    this.postagemService.contCurtidaPostagem(id).subscribe((resp: Postagem)=>{
      this.postagem2 = resp
    })
  }

  contClickRetiradaCurtida(id: number){
    this.postagemService.contRemoverCurtidaPostagem(id).subscribe((resp: Postagem)=>{
      this.postagem2 = resp
    })
  }

}