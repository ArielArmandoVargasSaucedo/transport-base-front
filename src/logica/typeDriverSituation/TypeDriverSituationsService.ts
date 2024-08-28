import { BadRequestInterface } from 'src/utils/BadRequestInterface';
import { TypeDriverSituationDTO } from './TypeDriverSituationDTO';
import { BadRequestError } from 'src/utils/BadRequestError';

export class TypeDriverSituationsService {
  static typeDriverSituationsService: TypeDriverSituationsService;

  private constructor() { }

  static getInstancie(): TypeDriverSituationsService {
    if (!this.typeDriverSituationsService)
      this.typeDriverSituationsService = new TypeDriverSituationsService();

    return this.typeDriverSituationsService;
  }

  async getTypeDriverSituations(): Promise<Array<TypeDriverSituationDTO>> {
    let listTypeDriverSituations: Array<TypeDriverSituationDTO> = new Array<TypeDriverSituationDTO>();
    const url = 'http://localhost:5000/type-driver-situation';

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
      listTypeDriverSituations = json;
    } catch (error) {
      if (error instanceof Error)
        console.log(error.message)
    }

    return listTypeDriverSituations;
  }

  async postTypeDriverSituation(nombre: string, is_fecha: boolean): Promise<void> {

    const url = 'http://localhost:5000/type-driver-situation';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type_ds_name: nombre,
          is_return: is_fecha,
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

  async deleteTypeDriverSituation(id: number): Promise<void> {

    const url = 'http://localhost:5000/type-driver-situation/' + id;


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

  async updateTypeDriverSituation(id: number, nombre: string): Promise<void> {

    const url = 'http://localhost:5000/type-driver-situation/' + id;

    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type_ds_name: nombre
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

}
