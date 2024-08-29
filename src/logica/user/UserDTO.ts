import { DriverDTO } from '../drivers/DriverDTO';
import { RoleDTO } from '../role/RoleDTO';

export class UserDTO {
  id_aut_user: number;
  user_name: string;
  email: string
  role: RoleDTO;
  driver: DriverDTO | undefined;

  constructor(
    id_aut_user: number,
    user_name: string,
    email: string,
    role: RoleDTO,
    driver: DriverDTO | undefined
  ) {
    this.id_aut_user = id_aut_user;
    this.user_name = user_name;
    this.email = email
    this.role = role;
    this.driver = driver;
  }
}
