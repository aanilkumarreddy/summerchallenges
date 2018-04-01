let loadedAtleta = {
    atleta: {},
    loadAtleta(atleta){
        this.atleta = atleta;
        //console.log('cargado PAPA!', this.atleta);

    },
    getAtleta(){
        return this.atleta;
    }
}
export { loadedAtleta };