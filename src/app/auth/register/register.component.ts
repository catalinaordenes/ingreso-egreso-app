import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;

  constructor(private fb: FormBuilder,
              private authSevice: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  crearUsuario(): void {
  if (this.registroForm.invalid) { return; }
    Swal.fire({
      title: "Espere por favor",
      didOpen: () => {
        Swal.showLoading();
      },
    });


  const { nombre, correo, password } = this.registroForm.value;
  this.authSevice.crearUsuario(nombre, correo, password)
    .then(credenciales => {
      Swal.close();
      console.log(credenciales);
      this.router.navigate(['/']);

    }).catch(err =>   {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.message,
    });
  });
  }
}
