import { TypeDriverSituationDTO } from "../typeDriverSituation/TypeDriverSituationDTO";

export class DriverSituationDTO {
  id_ds?: number
  return_date_ds?: Date;
  current_date_ds?: Date;
  type_driver_situation: TypeDriverSituationDTO | undefined;
  id_driver?: number;

  constructor(type_driver_situation: TypeDriverSituationDTO | undefined,
    return_date_ds?: Date,
    current_date_ds?: Date,
    id_driver?: number,
    id_ds?: number) {
    this.current_date_ds = current_date_ds
    this.type_driver_situation = type_driver_situation
    this.id_driver = id_driver
    this.return_date_ds = return_date_ds
    this.id_ds = id_ds
  }
}
