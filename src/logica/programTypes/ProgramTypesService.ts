import { ProgramTypeDTO } from './ProgramTypeDTO';

export class ProgramTypesService {
  static programTypesService: ProgramTypesService;

  private constructor() {}

  static getInstancie(): ProgramTypesService {
    if (!this.programTypesService)
      this.programTypesService = new ProgramTypesService();

    return this.programTypesService;
  }

  async getProgramTypes(): Promise<Array<ProgramTypeDTO>> {
      let listProgramTypes: Array<ProgramTypeDTO> = new Array<ProgramTypeDTO>();
      const url = 'http://localhost:5000/programming-type';
  
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
  
        // extraer el json de la respuesta
        const json = await res.json();
        listProgramTypes = json;
      } catch (error) {
          if(error instanceof Error)
              console.log(error.message)
      }
  
      return listProgramTypes;
    }
}
