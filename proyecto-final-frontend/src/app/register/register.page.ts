import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '../inicio/client/client';
import { ClientService } from '../inicio/client/client.service';
import { AlertService } from '../services/alert.service';
import { EncryptService } from '../services/encrypt.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  client: Client = new Client();

  formRegister: FormGroup;

  constructor(
    private clientService: ClientService, 
    private fb: FormBuilder, 
    private alert: AlertService,
    private encrypt: EncryptService,
    private router: Router,
    private datePipe: DatePipe 
    ) {
    this.formRegister = this.fb.group({
      'idType': new FormControl("", Validators.required),
      'idNumber': new FormControl("", Validators.required),
      'firstName': new FormControl("", Validators.required),
      'lastName': new FormControl("", Validators.required),
      'email': new FormControl("", Validators.required),
      'bornDate': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'confirmPassword': new FormControl("", Validators.required)
    })
  }

  ngOnInit() {
  }

  register() {
    if (this.formRegister.invalid) {
      this.alert.presentAlert('Hay campos vacíos');
      return;
    }
    var values = this.formRegister.value
    var currDate = new Date();
    this.client = values;
    this.client.created = this.datePipe.transform(currDate, 'yyyy-MM-dd')
    this.client.password = this.encrypt.encrypt(values.password)
    this.client.active = true;
    this.saveClient();
  }

  saveClient(){
    this.clientService.createClient(this.client).subscribe(data => {
      this.alert.presentSuccessToast("Cliente creado exitósamente")
      this.router.navigate(['/login'])
    }, err => { this.alert.presentErrorToast("Error del servidor") });
  }


}
