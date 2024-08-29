import { BadRequestInterface } from 'src/utils/BadRequestInterface';
import { TypeCarSituationDTO } from './TypeCarSituationDTO';
import { BadRequestError } from 'src/utils/BadRequestError';

export class TypeCarSituationsService {
  static typeCarSituationsService: TypeCarSituationsService;

  private constructor() { }

  static getInstancie(): TypeCarSituationsService {
    if (!this.typeCarSituationsService)
      this.typeCarSituationsService = new TypeCarSituationsService();

    return this.typeCarSituationsService;
  }

  async getTypeCarSituations(): Promise<Array<TypeCarSituationDTO>> {
    let listTypeCarSituations: Array<TypeCarSituationDTO> = new Array<TypeCarSituationDTO>();
    const url = 'http://localhost:5000/type-car-situation';

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
    listTypeCarSituations = json;

    return listTypeCarSituations;
  }

  async postTypeCarSituation(nombre: string, is_fecha: boolean): Promise<void> {

    const url = 'http://localhost:5000/type-car-situation';

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type_cs_name: nombre,
        is_return: is_fecha,
      })
    });

    // si el código del error es igual a 400 significa que hubo una badrequest
    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }
  }

  async deleteTypeCarSituation(id: number): Promise<void> {

    const url = 'http://localhost:5000/type-car-situation/' + id;

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


  async updateTypeCarSituation(id: number, nombre: string): Promise<void> {

    const url = 'http://localhost:5000/type-car-situation/' + id;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type_cs_name: nombre
      })
    });

    // si el código del error es igual a 400 significa que hubo una badrequest
    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }
  }
}
