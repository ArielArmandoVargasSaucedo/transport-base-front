import { is } from 'quasar';

export class CarSituationDTO {
  id_carSituation?: number;
  return_date_cs?: Date;
  current_date_cs?: Date;
  id_aut_type_cs: number;

  constructor(
    id_aut_type_cs: number,
    return_date_cs?: Date,
    current_date_cs?: Date,
    id_carSituation?: number
  ) {
    this.return_date_cs = return_date_cs;
    this.current_date_cs = current_date_cs;
    this.id_aut_type_cs = id_aut_type_cs;
    this.id_carSituation = id_carSituation;
  }
}
