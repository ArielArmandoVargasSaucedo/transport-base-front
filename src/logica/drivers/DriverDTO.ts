import { is } from 'quasar';
import { DriverSituationDTO } from '../driverSituation/DriverSituationDTO';
import { CarDTO } from '../car/CarDTO';

export class DriverDTO {
  id?: number;
  dni_driver: string;
  driver_name: string;
  home_address: string;
  is_copilot: boolean;
  driver_situation: DriverSituationDTO;
  car: CarDTO | undefined;

  constructor(
    dni_driver: string,
    driver_name: string,
    home_address: string,
    is_copilot: boolean,
    driver_situation: DriverSituationDTO,
    car: CarDTO | undefined,
    id?: number,
  ) {
    this.id = id;
    this.dni_driver = dni_driver;
    this.driver_name = driver_name;
    this.home_address = home_address;
    this.is_copilot = is_copilot;
    this.driver_situation = driver_situation;
    this.car = car;
  }
}
