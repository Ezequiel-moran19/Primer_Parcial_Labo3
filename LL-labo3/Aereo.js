import Vehiculo from './Vehiculo.js';

class Aereo extends Vehiculo {

    altMax;
    automania;

    constructor(id, modelo, anoFab, velMax, altMax, automania) {
      super(id, modelo, anoFab, velMax);
      this.altMax = altMax;
      this.automania = automania;
    }
  
  }
  
  export default Aereo;
  