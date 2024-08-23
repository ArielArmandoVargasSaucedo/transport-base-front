import { SolicitudeDTO } from "../solicitude/SolicitudeDTO";
import { GroupTourDTO } from "./GroupTourDTO";

export class GroupsToursService {
    static groupsToursService: GroupsToursService;

    private constructor() { }

    static getInstancie(): GroupsToursService {
        if (!this.groupsToursService) this.groupsToursService = new GroupsToursService();

        return this.groupsToursService;
    }

    async getGroupsTours(
        group_code?: number,
        group_country?: string,
        number_of_tourist?: number,
    ): Promise<Array<GroupTourDTO>> {
        let listGroupsTours: Array<GroupTourDTO> = new Array<GroupTourDTO>();

        try {
            //Se define los parámetros query de la petición
            const params = new URLSearchParams();
            if (group_code) params.append('group_code', group_code.toString());
            if (group_country) params.append('group_country', group_country);
            if (number_of_tourist) params.append('number_of_tourist', number_of_tourist.toString());

            const url = 'http://localhost:5000/group-tour?' + params;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            // extraer el json de la respuesta
            const json = await res.json();
            listGroupsTours = json;
        } catch (error) { }

        return listGroupsTours;
    }

    //Metodo para insertar un Carro
    async postGroupTour(
        group_code: number,
        group_country: string,
        number_of_tourist: number,
    ): Promise<void> {
        const url = 'http://localhost:5000/group-tour';

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_code: group_code,
                group_country: group_country,
                number_of_tourist: number_of_tourist,
            }),
        });

    }

    //Metodo para actualizar un Grupo Turístico
    async updateGrouptour(grouoTourDTO: GroupTourDTO): Promise<void> {
        const url = 'http://localhost:5000/group-tour/' + grouoTourDTO.id_group;

        try {
            const res = await fetch(url, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    group_code: grouoTourDTO.group_code,
                    group_country: grouoTourDTO.group_country,
                    number_of_tourist: grouoTourDTO.number_of_tourist,
                })
            })


            // extraer el json de la respuesta
            const json = await res.json();
        } catch (error) {
            if (error instanceof Error) console.log(error.message);
            // se relanza la exeption
        }
    }

}


