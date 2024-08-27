import { DriverSituationDTO } from "./DriverSituationDTO";

export class DriversSituationsService {
    static driverSituationsService: DriversSituationsService;

    private constructor() { }

    static getInstancie(): DriversSituationsService {
        if (!this.driverSituationsService) this.driverSituationsService = new DriversSituationsService();

        return this.driverSituationsService;
    }

    async getDriverSituations(
        date_ds?: Date,
        id_aut_type_ds?: number,
        id_driver?: number,
    ): Promise<Array<DriverSituationDTO>> {
        let listDriverSituations: Array<DriverSituationDTO> = new Array<DriverSituationDTO>();

        try {
            //Se define los parámetros query de la petición
            const params = new URLSearchParams();
            if (date_ds) params.append('date_ds', date_ds.toString());
            if (id_aut_type_ds) params.append('type_driver_situation', id_aut_type_ds.toString());
            if (id_driver) params.append('id_car', id_driver.toString());

            const url = 'http://localhost:5000/driver_situation?' + params;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            // extraer el json de la respuesta
            const json = await res.json();
            listDriverSituations = json;
        } catch (error) { }

        return listDriverSituations;


    }
}