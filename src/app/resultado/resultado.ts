export class Resultado{
    public id : number;
    public atletaId : string;
    public wodId : string;
    public video : string;
    public puntuacion : any;

    constructor(id, atleta, wod, puntuacion, video){
        this.id = id;
        this.atletaId = atleta;
        this.wodId = wod;        
        this.puntuacion = puntuacion;
        //El video será siempre opcional
        this.video = video || null;
    }
}