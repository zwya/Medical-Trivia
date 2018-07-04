export class User {
  username: string;
  password: string;
  admin?: boolean;
  id?: string;

  constructor(username: string, password: string, admin?: boolean, id?: string) {
    this.username = username;
    this.password = password;
    this.admin = admin;
    this.id = id;
  }
}
