export class Post {
  constructor(
    public _id : number = -1,
    public userId : string = '',
    public timestamp : Date = new Date(),
    public comment : string = ''
  ) { }

}
