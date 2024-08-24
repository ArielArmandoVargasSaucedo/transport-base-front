import { TypeCarSituationDTO } from "../typeCarSituation/TypeCarSituationDTO";
import { CarSituationDTO } from "./CarSituationDTO";

export class CarSituationsService {
    static carSituationsService: CarSituationsService;

    private constructor() { }

    static getInstancie(): CarSituationsService {
        if (!this.carSituationsService) this.carSituationsService = new CarSituationsService();

        return this.carSituationsService;
    }

    async getCarSituations(
        return_date_cs?: Date,
        current_date_cs?: Date,
        type_car_situation: TypeCarSituationDTO,
    ): Promise<Array<CarSituationDTO>> {
        let listCars: Array<CarSituationDTO> = new Array<CarSituationDTO>();

        try {
            //Se define los parámetros query de la petición
            const params = new URLSearchParams();
            if (return_date_cs) params.append('return_date_cs', return_date_cs.toString());
            if (current_date_cs) params.append('current_date_cs', current_date_cs.toString());
            if (type_car_situation) params.append('type_car_situation', type_car_situation.id_aut_type_cs.toString());
            if (type_car_situation) params.append('type_car_situation', type_car_situation.type_cs_name);

            const url = 'http://localhost:5000/car-situation?' + params;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            // extraer el json de la respuesta
            const json = await res.json();
            listCars = json;
        } catch (error) { }

        return listCarSituations;


    }