import { RolesEnum } from "src/utils/RolesEnum"

export class JwtDTO {
    access_token: string
    payload: {
        userId: number,
        role: RolesEnum
    }

    constructor(access_token: string,
        payload: {
            userId: number,
            role: RolesEnum
        }) {
        this.access_token = access_token
        this.payload = payload
    }

}