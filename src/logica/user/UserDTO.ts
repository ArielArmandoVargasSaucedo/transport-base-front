import { RoleDTO } from '../role/RoleDTO';

export class UserDTO {
  id_aut_user: number;
  user_name: string;
  password_user: string;
  email: string
  dni_user: string;
  role: RoleDTO | undefined;
  id_driver: number;

  constructor(
    id_aut_user: number,
    user_name: string,
    password_user: string,
    email: string,
    dni_user: string,
    role: RoleDTO | undefined,
    id_driver: number
  ) {
    this.id_aut_user = id_aut_user;
    this.user_name = user_name;
    this.password_user = password_user;
    this.email = email
    this.dni_user = dni_user;
    this.role = role;
    this.id_driver = id_driver;
  }
}
