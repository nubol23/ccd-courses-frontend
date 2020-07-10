export class User {
  uid: string;
  mail: string;
  name: string;
  role: string;
  signedIn: boolean;
  finishedSections: {};

  constructor(uid: string, mail: string, name: string, role: string, signedIn: boolean) {
    this.uid = uid;
    this.mail = mail;
    this.name = name;
    this.role = role;
    this.signedIn = signedIn;
    this.finishedSections = {};
  }
}

export class QueryUser {
  name: string;
  role: string;
  uid: string;
  finishedSections: string[];
}
