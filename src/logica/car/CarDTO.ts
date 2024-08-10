import {is} from 'quasar';

export class CarDTO {
    car_number: string;
    car_brand: string;
    number_of_seats: number;
    id_cs: number;

    constructor(
        car_number: string;
        car_brand: string;
        number_of_seats: number;
        id_cs: number;
    ){
        this.car_number=car_number
        this.car_brand=car_brand;
        this.number_of_seats=number_of_seats;
        this.id_cs=id_cs;
    }
}