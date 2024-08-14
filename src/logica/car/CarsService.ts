import { CarDTO } from './CarDTO';

export class CarsService {
  static carsService: CarsService;

  private constructor() {}

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

    try {
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

      // extraer el json de la respuesta
      const json = await res.json();
      listCars = json;
    } catch (error) {}

    return listCars;
  }

  //Metodo para insertar un carro
  async postCar(
    car_number: string,
    car_brand: string,
    number_of_seats: number,
    id_aut_type_cs: number,
    return_date_cs?: Date
  ): Promise<void> {
    const url = 'http://localhost:5000/car';

    try {
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
          car_situation: {
            return_date_cs: return_date_cs,
            id_aut_type_cs: id_aut_type_cs,
          },
        }),
      });

      // extraer el json de la respuesta
      const json = await res.json();
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      // se relanza la exeption
    }
  }

  async deleteCar(id_car: number): Promise<void> {
    const url = 'http://localhost:5000/car/' + id_car;

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
}
