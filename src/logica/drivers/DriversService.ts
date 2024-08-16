import { DriverDTO } from './DriverDTO';

export class DriversService {
  static driversService: DriversService;

  private constructor() { }

  static getInstancie(): DriversService {
    if (!this.driversService) this.driversService = new DriversService();

    return this.driversService;
  }

  async getDrivers(): Promise<Array<DriverDTO>> {
    let listDrivers: Array<DriverDTO> = new Array<DriverDTO>();
    const url = 'http://localhost:5000/driver';

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
    } catch (error) { }

    return listDrivers;
  }

  // Método para solicitar la insercción de un driver en la base de datos
  async postDriver(driverDTO: DriverDTO /* representa los datos a insertar de un driver */): Promise<void> {

    const url = 'http://localhost:5000/driver';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dni_driver: driverDTO.dni_driver,
          driver_name: driverDTO.driver_name,
          home_address: driverDTO.home_address,
          is_copilot: driverDTO.is_copilot,
          driver_situation: {
            return_date_ds: driverDTO.driver_situation.return_date_ds,
            id_aut_type_ds: driverDTO.driver_situation.type_driver_situation?.id_aut_type_ds
          },
          id_car: driverDTO.car?.id_car
        })
      });

      // extraer el json de la respuesta
      const json = await res.json();
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      // se relanza la exeption
    }
  }
  
}
