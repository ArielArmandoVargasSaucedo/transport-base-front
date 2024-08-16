import { is } from 'quasar';
import { TypeCarSituationDTO } from '../typeCarSituation/TypeCarSituationDTO';

export class CarSituationDTO {
  id_carSituation?: number;
  return_date_cs?: Date;
  current_date_cs?: Date;
  type_car_situation: TypeCarSituationDTO | undefined;

  constructor(
    type_car_situation: TypeCarSituationDTO | undefined,
    return_date_cs?: Date,
    current_date_cs?: Date,
    id_carSituation?: number,
  ) {
    this.return_date_cs = return_date_cs;
    this.current_date_cs = current_date_cs;
    this.type_car_situation = type_car_situation;
    this.id_carSituation = id_carSituation;
  }
}
