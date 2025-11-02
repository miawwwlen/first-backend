import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class loginUserDTO {
  username;
  password;

  constructor(data) {
    this.username = data.username;
    this.password = data.password;
  }
}

IsString()(loginUserDTO.prototype, 'username');
IsNotEmpty()(loginUserDTO.prototype, 'username');
MinLength(4)(loginUserDTO.prototype, 'username');
IsNotEmpty()(loginUserDTO.prototype, 'password');
IsString()(loginUserDTO.prototype, 'password');
MinLength(6)(loginUserDTO.prototype, 'password');
