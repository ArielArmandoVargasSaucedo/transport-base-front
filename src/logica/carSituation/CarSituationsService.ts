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
        date_cs?: Date,
        id_aut_type_cs?: number,
        id_car?: number,
    ): Promise<Array<CarSituationDTO>> {
        let listCarSituations: Array<CarSituationDTO> = new Array<CarSituationDTO>();

        try {
            //Se define los parámetros query de la petición
            const params = new URLSearchParams();
            if (date_cs) params.append('date_cs', date_cs.toString());
            if (id_aut_type_cs) params.append('type_car_situation', id_aut_type_cs.toString());
            if (id_car) params.append('id_car', id_car.toString());

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
            listCarSituations = json;
        } catch (error) { }

        return listCarSituations;


    }
}