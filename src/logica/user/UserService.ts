import { UserDTO } from './UserDTO';

export class UserService {
  static userService: UserService;

  private constructor() { }

  static getInstancie(): UserService {
    if (!this.userService) this.userService = new UserService();

    return this.userService;
  }

  async getUser(
    user?: string,
    password?: string,
    dni?: string,
    role?: number,
    id_driver?: number,
  ): Promise<Array<UserDTO>> {
    let listUser: Array<UserDTO> = new Array<UserDTO>();

    try {
      //Se define los parámetros query de la petición
      const params = new URLSearchParams();
      if (user) params.append('user_name', user);
      if (password) params.append('password_user', password);
      if (dni) params.append('dni_user', dni);
      if (role) params.append('role', role.toString());
      if (id_driver) params.append('id_driver', id_driver.toString());

      const url = 'http://localhost:5000/user?' + params;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // extraer el json de la respuesta
      const json = await res.json();
      listUser = json;
    } catch (error) { }

    return listUser;
  }

  //Metodo para insertar un Carro
  async postUser(
    user_name: string,
    password_user: string,
    dni_user: string,
    role: number,
    id_driver: number,
  ): Promise<void> {
    const url = 'http://localhost:5000/user';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: user_name,
          password_user: password_user,
          dni_user: dni_user,
          id_driver: id_driver,
          role: {
            id_aut_role: UserDTO.role?.id_aut_role,
            role_type: UserDTO.role?.role_type,
          },
        }),
      });

      // extraer el json de la respuesta
      const json = await res.json();
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      // se relanza la exeption
    }
  }

  async deleteUser(id_user: number): Promise<void> {

    const url = 'http://localhost:5000/user/' + id_user;

    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // extraer el json de la respuesta
      const json = await res.json();
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      // se relanza la exeption
    }
  }

  //Metodo para insertar un Carro
  async updateUser(userDTO: UserDTO): Promise<void> {
    const url = 'http://localhost:5000/user/' + userDTO.id_user;

    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: userDTO.user_name,
          password_user: userDTO.password_user,
          dni_user: userDTO.dni_user,
          role: {
            id_aut_role: userDTO.role?.id_aut_role,
            role_type: userDTO.role?.role_type,
          }
        }),
      });

      // extraer el json de la respuesta
      const json = await res.json();
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      // se relanza la exeption
    }
  }

}
