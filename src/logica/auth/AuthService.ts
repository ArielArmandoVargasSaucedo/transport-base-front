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

    // Método para cerrar la sesión
    public async logout() {
        this.jwt = undefined
        // además deberia de existir una lógica para que el backend registre este cierre de sesión
    }

    // Método para enviarle un correo electronico de verificación al usuario
    public async sendEmailVerificacion(user_id: number) {
        const url = 'http://localhost:5000/auth/sendEmailVerificacion/' + user_id;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });

        // si el código del error es igual a 400 significa que hubo una badrequest
        if (res.status === 400) {
            // obtener la respuesta
            const badRequest: BadRequestInterface = await res.json()
            throw new BadRequestError(badRequest.message)
        }

    }

    // Método para verificar el código introducido por el usuario
    public async verificarCodigoVerificacion(user_id: number, code: string) {
        const url = 'http://localhost:5000/auth/verificarCodigoVerificacion';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id /* hace referencia al identificador del usuario que introdujo el código */,
                code: code /* hace referencia al código introducido por el usuario */
            }),
        });

        // si el código del error es igual a 400 significa que hubo una badrequest
        if (res.status === 400) {
            // obtener la respuesta
            const badRequest: BadRequestInterface = await res.json()
            throw new BadRequestError(badRequest.message)
        }

    }

    // Método para cambiar la contraseña de un usuario en específico
    public async changePassword(id_user: number, new_password: string, last_password?: string) {
        const url = 'http://localhost:5000/auth/changePassword';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_user: id_user,
                new_password: new_password,
                last_password: last_password
            }),
        });

        // si el código del error es igual a 400 significa que hubo una badrequest
        if (res.status === 400) {
            // obtener la respuesta
            const badRequest: BadRequestInterface = await res.json()
            throw new BadRequestError(badRequest.message)
        }
    }

    // Método para obtener la identificación de un usuario dado su email
    public async getUserByEmail(email: string): Promise<number> {
        let user_id: number = -1
        const url = 'http://localhost:5000/auth/getUserByEmail';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
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
        user_id = json.user_id // se obtiene el identificador del usuario

        return user_id

    }
}