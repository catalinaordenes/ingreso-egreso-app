import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import {Usuario} from '../models/usuario.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {Store} from '@ngrx/store';
import {Appstate} from '../app.reducer';
import {setUser, unSetUser} from '../auth/auth.actions';
import {Observable, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<Appstate>) { }

  initAuthListener(){
    this.auth.authState.subscribe(fuser => {
      console.log(fuser?.uid);
      if (fuser){
       this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe((firestoreUser: any) => {
          const user = Usuario.fromFirebase(firestoreUser);
          this.store.dispatch(setUser({user}));
          });
      }
      else {
        this.userSubscription.unsubscribe();
        this.store.dispatch(unSetUser());
        console.log('Llamar unset de user');
      }
    });
  }

  crearUsuario(nombre, email, password) {
  return this.auth.createUserWithEmailAndPassword(email, password).then(
    ({user}) => {
      const newUser = new Usuario(user.uid, nombre, email);
      return this.firestore.doc(`${user.uid}/usuario`).set({...newUser});
    }
  );
  }

  loginUsuario(email, password){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
   return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map(fbUser=> fbUser != null)
    );
  }
}


