import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDTO {
  email;
  username;
  password;

  constructor(data) {
    this.email = data.email;
    this.username = data.username;
    this.password = data.password;
  }
}

IsEmail()(RegisterUserDTO.prototype, 'email');
IsString()(RegisterUserDTO.prototype, 'email');
IsNotEmpty()(RegisterUserDTO.prototype, 'email');
IsNotEmpty()(RegisterUserDTO.prototype, 'username');
IsString()(RegisterUserDTO.prototype, 'username');
MinLength(4)(RegisterUserDTO.prototype, 'username');
IsNotEmpty()(RegisterUserDTO.prototype, 'password');
IsString()(RegisterUserDTO.prototype, 'password');
MinLength(6)(RegisterUserDTO.prototype, 'password');
