import { CarDTO } from "../car/CarDTO";
import { DriverDTO } from "../drivers/DriverDTO";
import { GroupTourDTO } from "../groupTour/GroupTourDTO";
import { ProgramTypeDTO } from "../programTypes/ProgramTypeDTO";
import { RouteDTO } from "../route/Route.DTO";

export class SolicitudeDTO {
  id_solicitude: number;
  programming_to_be_done: string;
  mileage: number;
  car: CarDTO;
  driver: DriverDTO;
  programmingType: ProgramTypeDTO;
  groupTour: GroupTourDTO;
  dateD: Date;
  route: RouteDTO;

  constructor(
    id_solicitude: number,
    programming_to_be_done: string,
    mileage: number,
    car: CarDTO,
    driver: DriverDTO,
    programmingType: ProgramTypeDTO,
    groupTour: GroupTourDTO,
    dateD: Date,
    route: RouteDTO,
  ) {
    this.id_solicitude = id_solicitude
    this.programming_to_be_done = programming_to_be_done;
    this.mileage = mileage;
    this.car = car
    this.driver = driver
    this.programmingType = programmingType
    this.groupTour = groupTour
    this.dateD = dateD
    this.route = route
  }
}
