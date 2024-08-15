export class SolicitudeDTO{
    programming_start_time: string;
    programming_to_be_done: string;
    duration_time: string;
    mileage: number;
    id_car: number;
    id_aut_prog_type: number;
    id_group: number;
    id_aut_date: number;

    constructor(
        programming_start_time: string;
        programming_to_be_done: string;
        duration_time: string;
        mileage: number;
        id_car: number;
        id_aut_prog_type: number;
        id_group: number;
        id_aut_date: number;
    ){
        this.programming_start_time= programming_start_time;
        this.programming_to_be_done= programming_to_be_done;
        this.duration_time= duration_time;
        this.mileage= mileage;
        this.id_car= id_car;
        this.id_aut_prog_type= id_aut_prog_type;
        this.id_group= id_group;
        this.id_aut_date= id_aut_date;
    }
}