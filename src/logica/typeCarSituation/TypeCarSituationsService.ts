import { TypeCarSituationDTO } from './TypeCarSituationDTO';

export class TypeCarSituationsService {
    static typeCarSituationsService: TypeCarSituationsService;

    private constructor() {}

    static getInstancie(): TypeCarSituationsService {
      if (!this.typeCarSituationsService)
        this.typeCarSituationsService = new TypeCarSituationsService();

      return this.typeCarSituationsService;
    }

    async getTypeCarSituations(): Promise<Array<TypeCarSituationDTO>> {
        let listTypeCarSituations: Array<TypeCarSituationDTO> = new Array<TypeCarSituationDTO>();
        const url = 'http://localhost:5000/type-car-situation';

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
          listTypeCarSituations = json;
        } catch (error) {
            if(error instanceof Error)
                console.log(error.message)
        }

        return listTypeCarSituations;
      }

      async postTypeCarSituation(nombre: string, is_fecha:boolean): Promise<void> {

        const url = 'http://localhost:5000/type-car-situation';

        try {
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

          // extraer el json de la respuesta
          const json = await res.json();

        } catch (error) {
            if(error instanceof Error)
                console.log(error.message)
              // se relanza la exeption
        }

      }

      async deleteTypeCarSituation(id: number): Promise<void> {

        const url = 'http://localhost:5000/type-car-situation/' + id;

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
            if(error instanceof Error)
                console.log(error.message)
              // se relanza la exeption
        }

      }


      async updateTypeCarSituation(id:number, nombre: string): Promise<void> {

        const url = 'http://localhost:5000/type-car-situation/' + id;

        try {
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

          // extraer el json de la respuesta
          const json = await res.json();

        } catch (error) {
            if(error instanceof Error)
                console.log(error.message)
              // se relanza la exeption
        }

      }
}
