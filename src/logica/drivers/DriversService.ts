import { BadRequestInterface } from 'src/utils/BadRequestInterface';
import { DriverDTO } from './DriverDTO';
import { BadRequestError } from 'src/utils/BadRequestError';

export class DriversService {
  static driversService: DriversService;

  private constructor() { }

  static getInstancie(): DriversService {
    if (!this.driversService) this.driversService = new DriversService();

    return this.driversService;
  }

  async getDrivers(dni_driver?: string, driver_name?: string, type_driver_situation?: number, id_car?: number): Promise<Array<DriverDTO>> {
    let listDrivers: Array<DriverDTO> = new Array<DriverDTO>();

    try {
      //Se define los parámetros query de la petición
      const params = new URLSearchParams();
      if (dni_driver) params.append('dni_driver', dni_driver);
      if (driver_name) params.append('driver_name', driver_name);
      if (type_driver_situation) params.append('type_driver_situation', type_driver_situation.toString());
      if (id_car) params.append('id_car', id_car.toString());

      const url = 'http://localhost:5000/driver?' + params;
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

  async deleteDriver(id_driver: number): Promise<void> {

    const url = 'http://localhost:5000/driver/' + id_driver;

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
      if (error instanceof Error) console.log(error.message);
      // se relanza la exeption
    }
  }

  // Método para solicitar la insercción de un driver en la base de datos
  async postDriver(driverDTO: DriverDTO /* representa los datos a insertar de un driver */): Promise<void> {

    const url = 'http://localhost:5000/driver';

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

    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }

  }

  async updateDriver(driverDTO: DriverDTO): Promise<void> {
    const url = 'http://localhost:5000/driver/' + driverDTO.id;

    try {
      const res = await fetch(url, {
        method: 'PATCH',
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
        }),
      });

      // extraer el json de la respuesta
      const json = await res.json();
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      // se relanza la exeption
    }
  }

}
