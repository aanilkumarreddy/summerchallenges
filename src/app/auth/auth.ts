export class AuthGoogle{
    constructor ( public id : string, public name : string, public email : string, public avatar : string){
        
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.email = email;
    }
}
export class AuthCorreo{
    constructor ( public correo : string, public pass : string){
        this.correo = correo;
        this.pass = pass;
    }
}