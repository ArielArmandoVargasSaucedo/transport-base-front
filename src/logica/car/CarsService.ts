import { CarDTO } from './CarDTO';

export class CarsService {
  static carsService: CarsService;

  private constructor() {}

  static getInstancie(): CarsService {
    if (!this.carsService) this.carsService = new CarsService();

    return this.carsService;
  }

  async getCars(): Promise<Array<CarDTO>> {
    let listCars: Array<CarDTO> = new Array<CarDTO>();
    const url = 'http://localhost:5000/car';

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
      listCars = json;
    } catch (error) {}

    return listCars;
  }
}
