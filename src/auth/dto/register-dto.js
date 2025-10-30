import { IsEmail, IsString, MinLength } from 'class-validator';

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
IsString()(RegisterUserDTO.prototype, 'username');
MinLength(4)(RegisterUserDTO.prototype, 'username');
IsString()(RegisterUserDTO.prototype, 'password');
MinLength(6)(RegisterUserDTO.prototype, 'password');
