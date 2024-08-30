import { BadRequestInterface } from 'src/utils/BadRequestInterface';
import { SolicitudeDTO } from './SolicitudeDTO';
import { BadRequestError } from 'src/utils/BadRequestError';
import { GroupTourDTO } from '../groupTour/GroupTourDTO';
import { RouteDTO } from '../route/Route.DTO';

export class SolicitudeService {
  static solicitudeService: SolicitudeService;

  private constructor() { }

  static getInstancie(): SolicitudeService {
    if (!this.solicitudeService)
      this.solicitudeService = new SolicitudeService();
    return this.solicitudeService;
  }

  async getSolicitudes(
    id_car?: number,
    id_driver?: number,
    id_prog_type?: number,
    id_group?: number,
    date?: Date,
  ): Promise<Array<SolicitudeDTO>> {
    let listSolicitudes: Array<SolicitudeDTO> = new Array<SolicitudeDTO>();
    const url = 'http://localhost:5000/solicitude';


    //Se define los parámetros query de la petición
    const params = new URLSearchParams();
    if (id_car) params.append('id_car', id_car.toString());
    if (id_driver) params.append('id_driver', id_driver.toString());
    if (id_prog_type) params.append('id_aut_prog_type', id_prog_type.toString());
    if (id_group) params.append('id_group', id_group.toString());
    if (date) params.append('dateD', date.toString());

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
    listSolicitudes = json;


    return listSolicitudes;
  }

  //Metodo para insertar un Carro
  async postSolicitude(
    programming_start_time: string,
    programming_to_be_done: string,
    duration_time: string,
    mileage: number,
    id_car: number,
    id_aut_prog_type: number,
    id_group: number,
    groupDTO: GroupTourDTO | undefined,
    dateD: Date,
    routeDTO: RouteDTO,

  ): Promise<void> {
    const url = 'http://localhost:5000/solicitude';

    // se construye el body de la petición
    let body = {}

    // si se va a construir el grupo
    if (groupDTO)
      body = {
        programming_start_time: programming_start_time,
        programming_to_be_done: programming_to_be_done,
        duration_time: duration_time,
        mileage: mileage,
        id_car: id_car,
        id_aut_prog_type: id_aut_prog_type,
        //nuevo grupo
        groupDTO: {
          group_code: groupDTO?.group_code,
          group_country: groupDTO?.group_country,
          number_of_tourist: groupDTO?.number_of_tourist,
        },
        dateD: dateD,
        //nueva ruta
        routeDTO: {
          km_available_star: routeDTO.km_available_star,
          km_available_end: routeDTO.km_available_end,
          pick_up_location: routeDTO.pick_up_location,
          end_time: routeDTO.end_time,
        },
      }
    else // se va a asignar el grupo
      body = {
        programming_start_time: programming_start_time,
        programming_to_be_done: programming_to_be_done,
        duration_time: duration_time,
        mileage: mileage,
        id_car: id_car,
        id_aut_prog_type: id_aut_prog_type,
        //grupo seleccionado
        id_group: id_group,
        dateD: dateD,
        routeDTO: {
          km_available_star: routeDTO.km_available_star,
          km_available_end: routeDTO.km_available_end,
          pick_up_location: routeDTO.pick_up_location,
          end_time: routeDTO.end_time,
        },
      }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }
  }

  async deleteSolicitud(id_solicitud: number): Promise<void> {

    const url = 'http://localhost:5000/solicitude/' + id_solicitud;

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
/*
  //Metodo para actualizar
  async updateCar(solicitudDTO: SolicitudeDTO): Promise<void> {
    const url = 'http://localhost:5000/solicitude/' + solicitudDTO.id_solicitud;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        car_number: carDTO.car_number,
        car_brand: carDTO.car_brand,
        number_of_seats: carDTO.number_of_seats,
        currentCarSituation: {
          return_date_cs: carDTO.currentCarSituation.return_date_cs,
          id_aut_type_cs: carDTO.currentCarSituation.type_car_situation?.id_aut_type_cs,
        }
      }),
    });

    if (res.status === 400) {
      // obtener la respuesta
      const badRequest: BadRequestInterface = await res.json()
      throw new BadRequestError(badRequest.message)
    }

  }
*/

}
