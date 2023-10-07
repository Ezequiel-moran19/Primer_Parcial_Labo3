import Vehiculo from './Vehiculo.js';

class Terrestre extends Vehiculo {

    cantPue;
    cantRue;

    constructor(id, modelo, anoFab, velMax, cantPue, cantRue) {
        super(id, modelo, anoFab, velMax);
        this.cantPue = cantPue;
        this.cantRue = cantRue;
    }
  
  }
  
  export default Terrestre;