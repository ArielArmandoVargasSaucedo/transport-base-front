import { BadRequestInterface } from 'src/utils/BadRequestInterface';
import { DriverDTO } from './DriverDTO';
import { BadRequestError } from 'src/utils/BadRequestError';
import { DriverSituationDTO } from '../driverSituation/DriverSituationDTO';
import { AuthService } from '../auth/AuthService';

export class DriversService {
  static driversService: DriversService;

  private constructor() { }

  static getInstancie(): DriversService {
    if (!this.driversService) this.driversService = new DriversService();

    return this.driversService;
  }

  async getDrivers(dni_driver?: string, driver_name?: string, type_driver_situation?: number, id_car?: number): Promise<Array<DriverDTO>> {
    let listDrivers: Array<DriverDTO> = new Array<DriverDTO>();

    // se obtiene el token de autenticación
    const token = AuthService.getInstancie().getJwt()
    //Se define los parámetros query de la petición
    // si realmente está logeado
    if (token) {
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
          Authorization: 'Bearer ' + token.access_token
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
      listDrivers = json;
    }

    return listDrivers;
  }

  // Método para obtener el historial de situaciones de un chofer en específico
  async getHistorialDriverSituations(
    idDriver: number,
    nombreTipoSituacion?: string
  ): Promise<Array<DriverSituationDTO>> {
    let listDriverSituationsDTO: Array<DriverSituationDTO> = new Array<DriverSituationDTO>();

    //Se define los parámetros query de la petición
    const params = new URLSearchParams();
    if (nombreTipoSituacion) params.append('nombreTipoSituacion', nombreTipoSituacion);

    const url = 'http://localhost:5000/driver/getHistorialDriverSituations/' + idDriver + '?' + params;
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
    listDriverSituationsDTO = json;

    return listDriverSituationsDTO;
  }


  // Método para obtener la información de un driver en específico
  async getDriver(
    idDriver: number
  ): Promise<DriverDTO | undefined> {
    let driverDTO: DriverDTO | undefined = undefined


    const url = 'http://localhost:5000/driver/' + idDriver;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }

    // extraer el json de la respuesta
    const json = await res.json();
    driverDTO = json;


    return driverDTO;
  }

  // Método para obtener la información de los drivers que no poseen cuenta
  async getAllDriversWithOutAccount(

  ): Promise<Array<DriverDTO>> {
    let drivers: Array<DriverDTO> = new Array<DriverDTO>()

    const url = 'http://localhost:5000/driver/getAllDriversWithOutAccount'
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
    drivers = json;

    return drivers;
  }

  async deleteDriver(id_driver: number): Promise<void> {

    const url = 'http://localhost:5000/driver/' + id_driver;

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
        currentDriverSituation: {
          return_date_ds: driverDTO.currentDriverSituation.return_date_ds,
          id_aut_type_ds: driverDTO.currentDriverSituation.type_driver_situation?.id_aut_type_ds
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
        currentDriverSituation: {
          return_date_ds: driverDTO.currentDriverSituation.return_date_ds,
          id_aut_type_ds: driverDTO.currentDriverSituation.type_driver_situation?.id_aut_type_ds
        },
        id_car: driverDTO.car?.id_car
      }),
    });

    // si el código del error es igual a 400 significa que hubo una badrequest
    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }
  }
}
