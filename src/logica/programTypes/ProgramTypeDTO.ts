export class ProgramTypeDTO {
    id_aut_prog_type: number;
    prog_type_name: string;

    constructor( id_aut_prog_type: number, prog_type_name: string) {
      this.id_aut_prog_type =  id_aut_prog_type
      this.prog_type_name = prog_type_name;
    }
}


