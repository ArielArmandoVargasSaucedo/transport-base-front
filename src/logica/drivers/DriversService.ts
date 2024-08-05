import { DriverDTO } from './DriverDTO';

export class DriversService {
  static driversService: DriversService;

  private constructor() {}

  static getInstancie(): DriversService {
    if (!this.driversService) this.driversService = new DriversService();

    return this.driversService;
  }

  async getDrivers(): Promise<Array<DriverDTO>> {
    let listDrivers: Array<DriverDTO> = new Array<DriverDTO>();
    const url = 'http://localhost::5000/driver';

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
      listDrivers = json;
    } catch (error) {}

    return listDrivers;
  }
}
