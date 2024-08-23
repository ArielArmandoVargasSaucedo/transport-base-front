import { RoleDTO } from './roleDTO';



export class RoleService {
  static roleService: RoleService;

  private constructor() { }

  static getInstancie(): RoleService {
    if (!this.roleService)
      this.roleService = new RoleService();

    return this.roleService;
  }

  async getRole(): Promise<Array<RoleDTO>> {
    let listRole: Array<RoleDTO> = new Array<RoleDTO>();
    const url = 'http://localhost:5000/role';

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
      listRole = json;
    } catch (error) {
      if (error instanceof Error)
        console.log(error.message)
    }

    return listRole;
  }

  async postRole(nombre: string): Promise<void> {

    const url = 'http://localhost:5000/role';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role_type: nombre
        })
      });

      // extraer el json de la respuesta
      const json = await res.json();

    } catch (error) {
      if (error instanceof Error)
        console.log(error.message)
      // se relanza la exeption
    }

  }

  async deleteRole(id: number): Promise<void> {

    const url = 'http://localhost:5000/role/' + id;

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
      if (error instanceof Error)
        console.log(error.message)
      // se relanza la exeption
    }

  }
}
