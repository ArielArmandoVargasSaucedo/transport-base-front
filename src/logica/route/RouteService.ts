import { RouteDTO } from "./Route.DTO";

export class RouteService {
  static routeService: RouteService;

  private constructor() {}

  static getInstancie(): RouteService{
    if (!this.routeService)
      this.routeService = new RouteService();

    return this.routeService;
  }

  async getRutas(): Promise<Array<RouteDTO>> {
    let listRutas: Array<RouteDTO> = new Array<RouteDTO>();
    const url = 'http://localhost:5000/route';

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
      listRutas = json;
    } catch (error) {}

    return listRutas;
  }
}
