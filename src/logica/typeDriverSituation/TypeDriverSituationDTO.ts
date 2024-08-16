export class TypeDriverSituationDTO {
  id_aut_type_ds?: number;
  type_ds_name: string;

  constructor(type_ds_name: string, id_aut_type_ds?: number) {
    this.id_aut_type_ds = id_aut_type_ds
    this.type_ds_name = type_ds_name;
  }
}
