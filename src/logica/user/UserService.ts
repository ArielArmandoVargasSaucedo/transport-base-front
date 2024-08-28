import { BadRequestInterface } from 'src/utils/BadRequestInterface';
import { AuthService } from '../auth/AuthService';
import { UserDTO } from './UserDTO';
import { BadRequestError } from 'src/utils/BadRequestError';

export class UserService {
  static userService: UserService;

  private constructor() { }

  static getInstancie(): UserService {
    if (!this.userService) this.userService = new UserService();

    return this.userService;
  }

  async getUsers(
    user?: string,
    password?: string,
    role?: number,
    id_driver?: number,
  ): Promise<Array<UserDTO>> {
    let listUser: Array<UserDTO> = new Array<UserDTO>();

    // se obtiene el token
    const token = AuthService.getInstancie().getJwt()

    // si el usuario esta logeado
    if (token) {
      try {
        // se obtiene el id del usuario logeado
        const id_applicant = token.payload.userId
        //Se define los parámetros query de la petición
        const params = new URLSearchParams();
        if (user) params.append('user_name', user);
        if (password) params.append('password_user', password);
        if (role) params.append('role', role.toString());
        if (id_driver) params.append('id_driver', id_driver.toString());
        if (id_applicant) params.append('id_applicant', id_applicant.toString())

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
    }


    return listUser;
  }

  // Método para obtener la información de un usuario en específico
  async getUser(user_id: number): Promise<UserDTO | undefined> {
    let user: UserDTO | undefined = undefined

    // se obtiene el token
    const token = AuthService.getInstancie().getJwt()

    // si el usuario esta logeado
    if (token) {
      const url = 'http://localhost:5000/user/getUser/' + user_id;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // extraer el json de la respuesta
      const json = await res.json();
      user = json;

    }

    return user;
  }

  //Metodo para insertar un Carro
  /*async postUser(
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
  }*/

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
  async updateUser(user_id: number, user_name: string): Promise<void> {
    const url = 'http://localhost:5000/user/' + user_id;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name: user_name
      }),
    });

    // si el código del error es igual a 400 significa que hubo una badrequest
    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }

  }

}
