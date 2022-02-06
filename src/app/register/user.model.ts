export class User {
  constructor(
    public _id : number = -1,
    public username : string = '',
    public password : string = '',
    public name : string = '',
    public email : string = '',
    public salt : string = ''
  ) { }

}
