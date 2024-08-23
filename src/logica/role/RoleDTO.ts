export class RoleDTO {

  id_aut_role: number;
  role_type: string;
  constructor(id_aut_role: number, role_type: string) {
    this.id_aut_role = id_aut_role;
    this.role_type = role_type;
  }
}
