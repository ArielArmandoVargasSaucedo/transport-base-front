import { CarDTO } from "../car/CarDTO";
import { GroupTourDTO } from "../groupTour/GroupTourDTO";
import { ProgramTypeDTO } from "../programTypes/ProgramTypeDTO";
import { RouteDTO } from "../route/Route.DTO";

export class SolicitudeDTO{
    id_solicitud: number;
    programming_start_time: string;
    programming_to_be_done: string;
    duration_time: string;
    mileage: number;
    carDTO: CarDTO;
    prog_typeDTO: ProgramTypeDTO ;
    groupDTO: GroupTourDTO;
    dateDTO: Date;
    routeDTO: RouteDTO;

    constructor(
        id_solicitud: number,
        programming_start_time: string,
        programming_to_be_done: string,
        duration_time: string,
        mileage: number,
        carDTO: CarDTO,
        prog_typeDTO: ProgramTypeDTO,
        groupDTO: GroupTourDTO,
        dateDTO: Date,
        routeDTO: RouteDTO,
    ){
        this.id_solicitud = id_solicitud
        this.programming_start_time= programming_start_time;
        this.programming_to_be_done= programming_to_be_done;
        this.duration_time= duration_time;
        this.mileage= mileage;
        this.carDTO= carDTO;
        this.prog_typeDTO= prog_typeDTO;
        this.groupDTO= groupDTO;
        this.dateDTO= dateDTO;
        this.routeDTO= routeDTO;
    }
}
