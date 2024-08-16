import { SolicitudeDTO } from './SolicitudeDTO';

export class SolicitudeService {
  static solicitudeService: SolicitudeService;

  private constructor() {}

  static getInstancie(): SolicitudeService {
    if (!this.solicitudeService)
      this.solicitudeService = new SolicitudeService();

    return this.solicitudeService;
  }

  async getSolicitudes(): Promise<Array<SolicitudeDTO>> {
    let listSolicitudes: Array<SolicitudeDTO> = new Array<SolicitudeDTO>();
    const url = 'http://localhost:5000/solicitude';

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
      listSolicitudes = json;
    } catch (error) {}

    return listSolicitudes;
  }
}
