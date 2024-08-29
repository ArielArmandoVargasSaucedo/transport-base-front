import { BadRequestInterface } from 'src/utils/BadRequestInterface';
import { BadRequestError } from 'src/utils/BadRequestError';
import { RoleDTO } from './RoleDTO';



export class RoleService {
  static roleService: RoleService;

  private constructor() { }

  static getInstancie(): RoleService {
    if (!this.roleService)
      this.roleService = new RoleService();

    return this.roleService;
  }

  async getRoles(): Promise<Array<RoleDTO>> {
    let listRole: Array<RoleDTO> = new Array<RoleDTO>();
    const url = 'http://localhost:5000/role';

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // si el código del error es igual a 400 significa que hubo una badrequest
    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }

    // extraer el json de la respuesta
    const json = await res.json();
    listRole = json;

    return listRole;
  }

  async postRole(nombre: string): Promise<void> {

    const url = 'http://localhost:5000/role';

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

    // si el código del error es igual a 400 significa que hubo una badrequest
    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }
  }

  async deleteRole(id: number): Promise<void> {

    const url = 'http://localhost:5000/role/' + id;

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // si el código del error es igual a 400 significa que hubo una badrequest
    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }
  }
}
