import { TypeDriverSituationDTO } from './TypeDriverSituationDTO';

export class TypeDriverSituationsService {
  static typeDriverSituationsService: TypeDriverSituationsService;

  private constructor() {}

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
      if(error instanceof Error)
      console.log(error.message)
    }

    return listTypeDriverSituations;
  }
}
