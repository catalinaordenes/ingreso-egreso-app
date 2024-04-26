import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Store} from '@ngrx/store';
import {Appstate} from '../../app.reducer';
import {isLoading, stopLoading} from '../../shared/ui.actions';
import {Subscription} from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
             // el Appstate lo obtengo de app.reducer es el estado global de la app
              private store: Store<Appstate> ){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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

  loginUsuario(): void {
    if (this.loginForm.invalid) { return; }

    this.store.dispatch(isLoading());

    const { email, password } = this.loginForm.value;
    this.authService.loginUsuario(email, password)
      .then(credenciales => {
        console.log(credenciales);
        this.store.dispatch(stopLoading());
        this.router.navigate(['/']);

      }).catch(err =>
    {  this.store.dispatch(stopLoading());
       Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      });
    });
  }

}
