import { is } from 'quasar';
import { SolicitudeDTO } from '../solicitude/SolicitudeDTO';

export class GroupTourDTO {
  id_group?: number;
  group_code: number;
  group_country: string;
  number_of_tourist: number;


  constructor(
    group_code: number,
    group_country: string,
    number_of_tourist: number,
    id_group?: number,
  ) {
    this.id_group = id_group;
    this.group_code = group_code;
    this.group_country = group_country;
    this.number_of_tourist = number_of_tourist;

  }
}
