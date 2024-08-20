import { BadRequestInterface } from "src/utils/BadRequestInterface";
import { JwtDTO } from "./JwtDTO";
import { BadRequestError } from "src/utils/BadRequestError";
import { RolesEnum } from "src/utils/RolesEnum";

export class AuthService {
    static authService: AuthService;
    private jwt: JwtDTO | undefined // representa el token que se obtiene despues del logeo
    private constructor() {
        this.jwt = undefined
    }

    static getInstancie(): AuthService {
        if (!this.authService) this.authService = new AuthService();

        return this.authService;
    }

    // Método para obtener el jwt
    public getJwt(): JwtDTO | undefined {
        return this.jwt
    }

    // Método para verificar si el rol se encuentra en la lista de roles de una ruta
    public verificarRol(rolesRuta: Array<RolesEnum>) {
        if (this.jwt) 
            return rolesRuta.includes(this.jwt.payload.role) // si dentro de los roles de la ruta se encuentra el rol del token
        else
            return false
    }

    // Método para logearse y obtener el token
    public async login(userName: string, password: string) {
        const url = 'http://localhost:5000/auth/login';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_name: userName,
                password_user: password
            }),
        });

        // si el código del error es igual a 400 significa que hubo una badrequest
        if (res.status === 400) {
            // obtener la respuesta
            const badRequest: BadRequestInterface = await res.json()
            throw new BadRequestError(badRequest.message)
        }

        // extraer el json de la respuesta
        const json = await res.json();
        this.jwt = json // se asigna el token
        // se alamacena el token en el local storage
    }
}