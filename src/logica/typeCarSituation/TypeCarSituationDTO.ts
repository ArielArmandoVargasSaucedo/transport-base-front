export class TypeCarSituationDTO {
    id_aut_type_cs: number;
    type_cs_name: string;
    is_return: boolean;
    constructor(id_aut_type_cs: number, type_cs_name: string, is_return: boolean) {
        this.id_aut_type_cs = id_aut_type_cs
        this.type_cs_name = type_cs_name
        this.is_return = is_return
    }
}
