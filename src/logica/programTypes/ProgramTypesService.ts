import { BadRequestInterface } from 'src/utils/BadRequestInterface';
import { ProgramTypeDTO } from './ProgramTypeDTO';
import { BadRequestError } from 'src/utils/BadRequestError';

export class ProgramTypesService {
  static programTypesService: ProgramTypesService;

  private constructor() { }

  static getInstancie(): ProgramTypesService {
    if (!this.programTypesService)
      this.programTypesService = new ProgramTypesService();

    return this.programTypesService;
  }

  async getProgramTypes(): Promise<Array<ProgramTypeDTO>> {
    let listProgramTypes: Array<ProgramTypeDTO> = new Array<ProgramTypeDTO>();
    const url = 'http://localhost:5000/programming-type';

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // si el código del error es igual a 400 significa que hubo una badrequest
    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }

    // extraer el json de la respuesta
    const json = await res.json();
    listProgramTypes = json;

    return listProgramTypes;
  }


  async postTypeProgram(nombre: string): Promise<void> {

    const url = 'http://localhost:5000/programming-type';

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prog_type_name: nombre,
      })
    });

    // si el código del error es igual a 400 significa que hubo una badrequest
    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }
  }

  async deleteTypeProgram(id: number): Promise<void> {

    const url = 'http://localhost:5000/programming-type/' + id;

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // si el código del error es igual a 400 significa que hubo una badrequest
    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }
  }

  async updateTypeProgram(id: number, nombre: string): Promise<void> {

    const url = 'http://localhost:5000/programming-type/' + id;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prog_type_name: nombre
      })
    });

    // si el código del error es igual a 400 significa que hubo una badrequest
    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }
  }
}
