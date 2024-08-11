export class CreateUserDto {
  user_name: string;
  password_user: string;
  dni_user: string;
  id_aut_role: number;
  id_driver: number;

  constructor(
    user_name: string,
    password_user: string,
    dni_user: string,
    id_aut_role: number,
    id_driver: number
  ) {
    this.user_name = user_name;
    this.password_user = password_user;
    this.dni_user = dni_user;
    this.id_aut_role = id_aut_role;
    this.id_driver = id_driver;
  }
}
