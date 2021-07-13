import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { RodapeComponent } from './rodape/rodape.component';
import { SobreNosComponent } from './sobre-nos/sobre-nos.component';
import { InicioComponent, SafePipe } from './inicio/inicio.component';
import { ContatoComponent } from './contato/contato.component';
import { EntrarComponent } from './entrar/entrar.component';
import { CadastrarComponent } from './cadastrar/cadastrar.component';
import { VagasComponent } from './vagas/vagas.component';

import { PerfilComponent } from './perfil/perfil.component';

import { MinhasPostagensComponent } from './minhas-postagens/minhas-postagens.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PostagemEditComponent } from './edit/postagem-edit/postagem-edit.component';
import { TemaComponent } from './tema/tema.component';
import { TemaEditComponent } from './edit/tema-edit/tema-edit.component';
import { TemaDeleteComponent } from './deletar/tema-delete/tema-delete.component';
<<<<<<< HEAD
import { AlertaComponent } from './alerta/alerta.component';
import { ModalModule } from 'ngx-bootstrap/modal';
=======
import { OrderModule } from 'ngx-order-pipe';
>>>>>>> 42e65333481aef68faab0e59fc9da4a55deaedce



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RodapeComponent,
    SobreNosComponent,
    InicioComponent,
    ContatoComponent,
    EntrarComponent,
    CadastrarComponent,
    VagasComponent,
    PerfilComponent,
    MinhasPostagensComponent,
    PostagemEditComponent,
    SafePipe,
    TemaComponent,
    TemaEditComponent,
    TemaDeleteComponent,
    AlertaComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ModalModule.forRoot()

  ],
  providers: [{
    provide:LocationStrategy,
    useClass:HashLocationStrategy
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
