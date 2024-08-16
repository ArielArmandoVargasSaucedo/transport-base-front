import { is } from 'quasar';
import { CarSituationDTO } from '../carSituation/CarSituationDTO';

export class CarDTO {
  id_car: number;
  car_number: string;
  car_brand: string;
  number_of_seats: number;
  car_situation: CarSituationDTO | undefined;

  constructor(
    id_car: number,
    car_number: string,
    car_brand: string,
    number_of_seats: number,
    car_situation: CarSituationDTO | undefined
  ) {
    this.id_car = id_car;
    this.car_number = car_number;
    this.car_brand = car_brand;
    this.number_of_seats = number_of_seats;
    this.car_situation = car_situation
  }
}
