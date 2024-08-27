import { is } from 'quasar';
import { CarSituationDTO } from '../carSituation/CarSituationDTO';

export class CarDTO {
  id_car: number;
  car_number: string;
  car_brand: string;
  number_of_seats: number;
  currentCarSituation: CarSituationDTO ;

  constructor(
    id_car: number,
    car_number: string,
    car_brand: string,
    number_of_seats: number,
    currentCarSituation: CarSituationDTO 
  ) {
    this.id_car = id_car;
    this.car_number = car_number;
    this.car_brand = car_brand;
    this.number_of_seats = number_of_seats;
    this.currentCarSituation = currentCarSituation
  }
}
