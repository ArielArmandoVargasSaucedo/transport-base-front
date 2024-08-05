import { is } from 'quasar';

export class DriverDTO {
  id: number;
  dni_driver: string;
  driver_name: string;
  home_address: string;
  category: string;
  is_copilot: boolean;
  id_ds: number;
  id_car: number;

  constructor(
    id: number,
    dni_driver: string,
    driver_name: string,
    home_address: string,
    category: string,
    is_copilot: boolean,
    id_ds: number,
    id_car: number
  ) {
    this.id = id;
    this.dni_driver = dni_driver;
    this.driver_name = driver_name;
    this.home_address = home_address;
    this.category = category;
    this.is_copilot = is_copilot;
    this.id_ds = id_ds;
    this.id_car = id_car;
  }
}
