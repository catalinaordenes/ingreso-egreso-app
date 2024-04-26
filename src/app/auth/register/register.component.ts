import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import Swal from 'sweetalert2';
import {Store} from '@ngrx/store';
import {Appstate} from '../../app.reducer';
import {Subscription} from 'rxjs';
import {isLoading, stopLoading} from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private authSevice: AuthService,
              private router: Router,
              private store: Store<Appstate> ) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui')
      .subscribe(ui => {
        this.cargando = ui.isLoading;
        console.log('cargando subs'); });
  }
  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(): void {
  if (this.registroForm.invalid) { return; }

  this.store.dispatch(isLoading());

  const { nombre, correo, password } = this.registroForm.value;
  this.authSevice.crearUsuario(nombre, correo, password)
    .then(credenciales => {
      console.log(credenciales);
      this.store.dispatch(stopLoading());
      this.router.navigate(['/']);

    }).catch(err =>   {
    this.store.dispatch(stopLoading());
  });
  }
}
