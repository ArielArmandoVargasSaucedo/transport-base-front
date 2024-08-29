import { SolicitudeDTO } from './SolicitudeDTO';

export class SolicitudeService {
  static solicitudeService: SolicitudeService;

  private constructor() {}

  static getInstancie(): SolicitudeService {
    if (!this.solicitudeService)
      this.solicitudeService = new SolicitudeService();
  return this.solicitudeService;
  }

  async getSolicitudes(
    id_car: number,
    id_driver: number,
    id_prog_type: number,
    id_group: number,
    id_date: Date,
  ): Promise<Array<SolicitudeDTO>> {
    let listSolicitudes: Array<SolicitudeDTO> = new Array<SolicitudeDTO>();
    const url = 'http://localhost:5000/solicitude';

    try {
 //Se define los parámetros query de la petición
 const params = new URLSearchParams();
 if (id_car) params.append('carDTO', id_car.toString());
 if (id_driver) params.append('driverDTO', id_driver.toString());
 if (id_prog_type) params.append('prog_typeDTO', id_prog_type.toString());
 if (id_group) params.append('groupDTO', id_group.toString());
 if (id_date) params.append('dateDTO', id_date.toString());

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // extraer el json de la respuesta
      const json = await res.json();
      listSolicitudes = json;
    } catch (error) {}

    return listSolicitudes;
  }
}
