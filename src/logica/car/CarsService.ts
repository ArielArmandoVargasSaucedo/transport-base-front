import { BadRequestInterface } from 'src/utils/BadRequestInterface';
import { CarDTO } from './CarDTO';
import { BadRequestError } from 'src/utils/BadRequestError';
import { CarSituationDTO } from '../carSituation/CarSituationDTO';

export class CarsService {
  static carsService: CarsService;

  private constructor() { }

  static getInstancie(): CarsService {
    if (!this.carsService) this.carsService = new CarsService();

    return this.carsService;
  }

  async getCars(
    brand?: string,
    number?: string,
    numOfSeats?: number
  ): Promise<Array<CarDTO>> {
    let listCars: Array<CarDTO> = new Array<CarDTO>();

    //Se define los parámetros query de la petición
    const params = new URLSearchParams();
    if (number) params.append('car_number', number);
    if (brand) params.append('car_brand', brand);
    if (numOfSeats) params.append('number_of_seats', numOfSeats.toString());

    const url = 'http://localhost:5000/car?' + params;
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
    listCars = json;

    return listCars;
  }

  // Método para obtener la información de un carro en específico
  async getCar(
    idCar: number
  ): Promise<CarDTO | undefined> {
    let carDTO: CarDTO | undefined = undefined

    const url = 'http://localhost:5000/car/' + idCar;
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
    carDTO = json;

    return carDTO;
  }

  // Método para obtener el historial de situaciones de un carro en específico
  async getHistorialCarSituations(
    idCar: number,
    nombreTipoSituacion?: string
  ): Promise<Array<CarSituationDTO>> {
    let listCarSituationsDTO: Array<CarSituationDTO> = new Array<CarSituationDTO>();

    //Se define los parámetros query de la petición
    const params = new URLSearchParams();
    if (nombreTipoSituacion) params.append('nombreTipoSituacion', nombreTipoSituacion);

    const url = 'http://localhost:5000/car/getHistorialCarSituations/' + idCar + '?' + params;
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
    listCarSituationsDTO = json;

    return listCarSituationsDTO;
  }

  //Metodo para insertar un Carro
  async postCar(
    car_number: string,
    car_brand: string,
    number_of_seats: number,
    id_aut_type_cs: number,
    return_date_cs?: Date
  ): Promise<void> {
    const url = 'http://localhost:5000/car';


    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        car_number: car_number,
        car_brand: car_brand,
        number_of_seats: number_of_seats,
        currentCarSituation: {
          return_date_cs: return_date_cs,
          id_aut_type_cs: id_aut_type_cs,
        },
      }),
    });

    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }

  }

  async deleteCar(id_car: number): Promise<void> {

    const url = 'http://localhost:5000/car/' + id_car;

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

  //Metodo para actualizar un Carro
  async updateCar(carDTO: CarDTO): Promise<void> {
    const url = 'http://localhost:5000/car/' + carDTO.id_car;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        car_number: carDTO.car_number,
        car_brand: carDTO.car_brand,
        number_of_seats: carDTO.number_of_seats,
        currentCarSituation: {
          return_date_cs: carDTO.currentCarSituation.return_date_cs,
          id_aut_type_cs: carDTO.currentCarSituation.type_car_situation?.id_aut_type_cs,
        }
      }),
    });

    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }

  }

}
