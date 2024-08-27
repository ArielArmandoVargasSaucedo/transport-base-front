export class TypeDriverSituationDTO {
  id_aut_type_ds: number;
  type_ds_name: string;
  is_return: boolean;

  constructor(type_ds_name: string, id_aut_type_ds: number, is_return: boolean) {
    this.id_aut_type_ds = id_aut_type_ds
    this.type_ds_name = type_ds_name;
    this.is_return = is_return;
  }
}
