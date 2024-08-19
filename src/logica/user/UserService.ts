import { UserDto } from 'src/logica/user/UserDTO';

export class UserService {
  static UserService: UserService;

  private constructor() {}

  static getInstancie(): UserService {
    if (!this.UserService) this.UserService = new UserService();

    return this.UserService;
  }

  async getUsers(): Promise<Array<UserDto>> {
    let listUsers: Array<UserDto> = new Array<UserDto>();
    const url = 'http://localhost:5000/user';

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // extraer el json de la respuesta
      const json = await res.json();
      listUsers = json;
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    }

    return listUsers;
  }

  async postUser(user: string, password: string): Promise<void> {
    const url = 'http://localhost:5000/user';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: user,
          password_user: password,
        }),
      });

      // extraer el json de la respuesta
      const json = await res.json();
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      // se relanza la exeption
    }
  }

  async deleteUser(id: number): Promise<void> {
    const url = 'http://localhost:5000/user/' + id;

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
}
