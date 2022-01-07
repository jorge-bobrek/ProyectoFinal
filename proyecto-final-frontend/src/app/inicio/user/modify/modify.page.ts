import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { EncryptService } from 'src/app/services/encrypt.service';
import { AccountService } from '../account/account.service';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.page.html',
  styleUrls: ['./modify.page.scss'],
})
export class ModifyPage implements OnInit {

  user?: User = new User();

  formModify: FormGroup;

  constructor(
    private userService: UserService,
    private encrypt: EncryptService,
    private fb: FormBuilder,
    private alert: AlertService,
    private router: Router
  ) {
    this.formModify = this.fb.group({
      'idType': new FormControl(""),
      'idNumber': new FormControl(""),
      'firstName': new FormControl(""),
      'lastName': new FormControl(""),
      'email': new FormControl(""),
      'bornDate': new FormControl(""),
      'password': new FormControl(""),
      'confirmPassword': new FormControl(""),
      'oldPassword': new FormControl("", Validators.required),
    })
  }

  ngOnInit() {
  }
  
  ionViewWillEnter(): void {
    if(!this.userService.user){
      this.router.navigate(['/inicio'])
    } else {  
      this.userService.getUser().subscribe(data => {
        this.user = data;
      });
    }
  }

  modify() {
    if (this.formModify.invalid) {
      this.alert.presentAlert('Ingrese su contraseña actual');
      return;
    }
    var values = this.formModify.value
    if (!this.encrypt.compare(values.oldPassword, this.user.password)) {
      this.alert.presentAlert('Contraseña incorrecta');
      return;
    }
    if (values.idType) {
      this.user.idType = values.idType
    }
    if (values.idNumber) {
      this.user.idNumber = values.idNumber
    }
    if (values.firstName) {
      this.user.firstName = values.firstName
    }
    if (values.lastName) {
      this.user.lastName = values.lastName
    }
    if (values.email) {
      this.user.email = values.email
    }
    if (values.bornDate) {
      this.user.bornDate = values.bornDate
    }
    if (values.password && values.confirmPassword) {
      if (values.password == values.confirmPassword) {
        this.user.password = this.encrypt.encrypt(values.password)
      } else {
        this.alert.presentAlert('Las contraseñas no coinciden');
        return;
      }
    } 
    this.updateUser();
  }

  updateUser() {
    this.userService.updateUser(this.user).subscribe(data => {
      this.alert.presentSuccessToast("Usuario modificado exitosamente")
      this.router.navigate(['/inicio'])
    }, err => { this.alert.presentErrorToast("Error del servidor") });
  }
}
