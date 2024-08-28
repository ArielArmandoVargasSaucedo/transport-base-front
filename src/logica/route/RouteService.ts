import { BadRequestInterface } from "src/utils/BadRequestInterface";
import { RouteDTO } from "./Route.DTO";
import { BadRequestError } from "src/utils/BadRequestError";

export class RouteService {
  static routeService: RouteService;

  private constructor() { }

  static getInstancie(): RouteService {
    if (!this.routeService)
      this.routeService = new RouteService();

    return this.routeService;
  }

  async getRutas(): Promise<Array<RouteDTO>> {
    let listRutas: Array<RouteDTO> = new Array<RouteDTO>();
    const url = 'http://localhost:5000/route';

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
    listRutas = json;

    return listRutas;
  }
}
