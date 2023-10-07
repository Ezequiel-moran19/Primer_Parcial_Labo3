
import Vehiculo from './Vehiculo.js';
import Aereo from './Aereo.js';
import Terrestre from './Terrestre.js';

document.addEventListener("DOMContentLoaded", function() {

// Carga del array
let objetos = [];
const jsonString = '[{"id":14, "modelo":"Ferrari F100", "anoFab":1998, "velMax":400, "cantPue":2, "cantRue":4},{"id":51, "modelo":"DodgeViper", "anoFab":1991, "velMax":266, "cantPue":2, "cantRue":4},{"id":67, "modelo":"Boeing CH-47 Chinook","anoFab":1962, "velMax":302, "altMax":6, "autonomia":1200},{"id":666, "modelo":"Aprilia RSV 1000 R","anoFab":2004, "velMax":280, "cantPue":0, "cantRue":2},{"id":872, "modelo":"Boeing 747-400", "anoFab":1989,"velMax":988, "altMax":13, "autonomia":13450},{"id":742, "modelo":"Cessna CH-1 SkyhookR", "anoFab":1953,"velMax":174, "altMax":3, "autonomia":870}]';
let data = JSON.parse(jsonString);

function crearObjeto(item) {
    if (item.id > 1) {
        if ('altMax' in item && 'autonomia' in item) {
            objetos.push(new Aereo(item.id, item.modelo, item.anoFab, item.velMax, item.altMax, item.autonomia));
        } else if ('cantPue' in item && 'cantRue' in item) {
            objetos.push(new Terrestre(item.id, item.modelo, item.anoFab, item.velMax, item.cantPue, item.cantRue));
        } else {
            objetos.push(new Vehiculo(item.id, item.modelo, item.anoFab, item.velMax));
        }
    }
}

data.forEach(crearObjeto);
console.log(objetos);

const vehiculoValido = (object) => ( object.id > 0 && typeof object.modelo === 'string' && object.modelo.trim() !== '' && object.anoFab > 0 && object.velMax > 0 );

const AereoValido  = object => (vehiculoValido(object) && object.altMax > 0 && object.autonomia > 0 );

const TerrestreValido = object => (vehiculoValido(object) && object.cantPue >= -1 && object.cantRue > 0);

const validarId = (id) => !objetos.some(objeto => objeto.id === id);

// Formulario ALTA
let btnNuevoVehiculo = document.getElementById("nuevoVehicuo");
btnNuevoVehiculo.addEventListener("click", cambiarVisibilidad);

let botonAlta = document.getElementById("nuevo");
botonAlta.addEventListener("click", agregarPersona);

let botonCancelar = document.getElementById("cancelar");
botonCancelar.addEventListener("click", cambiarVisibilidad);

let botonModificar = document.getElementById("modificar");
botonModificar.addEventListener("click", modificarVehiculo);

let select = document.getElementById("select");
select.addEventListener("change", cambiarOpciones);

// Se carga al hacer doble click
let vehiculoAModificar = null;
let mensajeAlert = "no se pudo dar de alta";

function agregarPersona() {
    mensajeAlert = "";
    let alta = leerDatos();
    if (alta != null && validarId(alta.id)) {
        objetos.push(alta);
        limpiarTabla();
        generarTabla();
        cambiarVisibilidad();
    } else {
        let lblError = document.getElementById("error");
        lblError.innerHTML = mensajeAlert;
    }
}

function modificarVehiculo() {
    mensajeAlert = "";
    let vehiculoLeido = leerDatos();
    let index = objetos.indexOf(vehiculoAModificar);

    if (vehiculoLeido != null) {
        objetos[index] = vehiculoLeido;
    } else {
        alert("Ocurrió un error.");
    }

    generarTabla();
    cambiarVisibilidad();
}
function eliminarVehiculo(){
    let trs = document.getElementById("bodyTabla").childNodes;
    if(confirm("¿Desea eliminar a " + vehiculoAModificar.modelo + " " + vehiculoAModificar.anoFab + "?"))
    {
        let index= objetos.indexOf(vehiculoAModificar);
        objetos.splice(index,1);
        generarTabla();
        cambiarVisibilidad();
    }
}

function generarId() {
    let id;
    do {
        id = Math.floor(Math.random() * 10000) + 1;
    } while (objetos.some(p => p && p.id == id));

    mensajeAlert = ""; 

    return id;
}

function leerDatos() {
    const id = obtenerId();
    const modelo = obtenerValor("inputModelo");
    const anoFab = obtenerValor("inputAnoFab");
    const velMaz = obtenerValor("inputVelMax");
    const seleccion = obtenerValor("select");
   
    let vehiculoRecibido;

    if (seleccion === "Aereo") {
        vehiculoRecibido = leerAereo(id, modelo, anoFab, velMaz);
    } else if (seleccion === "Terrestre") {
        vehiculoRecibido = leerTerrestre(id, modelo, anoFab, velMaz);
    }

    return vehiculoRecibido;
}

function obtenerId() {
    let id = document.getElementById("inputId").value;
    
    if (id === "") {
        id = generarId();
    }

    return parseInt(id);
}

function obtenerValor(elementId) {
    return document.getElementById(elementId).value;
}

function leerAereo(id, modelo, anoFab, velMaz) {
    const altMax = parseInt(obtenerValor("inputOpcional1"));
    const automania = parseInt(obtenerValor("inputOpcional2"));

    if (AereoValido({ id, modelo, anoFab, velMaz, altMax, automania })) {
        return new Aereo(id, modelo, anoFab, velMaz, altMax, automania);
    } else {
        mensajeAlert = "Hay un error en la carga de los campos"; // Establecer el mensaje de error
        return null;
    }
}

function leerTerrestre(id, modelo, anoFab, velMaz) {
    const cantPue = parseInt(obtenerValor("inputOpcional3"));
    const cantRue = obtenerValor("inputOpcional4");

    if (TerrestreValido({ id, modelo, anoFab, velMaz, cantPue, cantRue })) {
        return new Terrestre(id, modelo, anoFab, velMaz, cantPue, cantRue);
    } else {
        mensajeAlert = "Hay un error en la carga de los campos"; // Establecer el mensaje de error
        return null;
    }
}

function cambiarOpciones() {
    const selectedValue = document.getElementById("select").value;

    // Obtener los elementos relacionados con las opciones
    const opciones = [
        { label: "lblOpcional1", input: "inputOpcional1" },
        { label: "lblOpcional2", input: "inputOpcional2" },
        { label: "lblOpcional3", input: "inputOpcional3" },
        { label: "lblOpcional4", input: "inputOpcional4" }
    ];

    // Ocultar todos los campos relacionados con las opciones
    opciones.forEach(opcion => {
        const label = document.getElementById(opcion.label);
        const input = document.getElementById(opcion.input);
        label.style.display = "none";
        input.style.display = "none";
    });

    // Mostrar los campos relacionados con la opción seleccionada
    if (selectedValue === "Aereo") {
        mostrarCampos(["lblOpcional1", "inputOpcional1", "lblOpcional2", "inputOpcional2"]);
    } else if (selectedValue === "Terrestre") {
        mostrarCampos(["lblOpcional3", "inputOpcional3", "lblOpcional4", "inputOpcional4"]);
    }
}

function mostrarCampos(campos) {
    campos.forEach(campo => {
        const elemento = document.getElementById(campo);
        elemento.style.display = "";
    });
}

function cambiarVisibilidad() {
    let e = document.getElementById("formAbm");
    let tabla = document.getElementById("divTabla");
    let boton = document.getElementById("nuevoVehicuo");
    mensajeAlert = "";

    // Veo la tabla
    if (e.style.display == "") {
        e.style.display = "none";
        tabla.style.display = "";
        boton.value = "Dar de alta";
        // Reinicio el formulario de alta/baja/modificación
        limpiarCampos();
        document.getElementById("nuevo").style.display = "";
        document.getElementById("modificar").style.display = "none";
        document.getElementById("eliminar").style.display = "none";
    } else { // Volver al formulario
        e.style.display = "";
        tabla.style.display = "none";
        boton.value = "Volver";
        divSelect.style.display = "";
    }
}

function cargarCampos(event) {
    const idClickeado = event.target.parentNode.id;
    vehiculoAModificar = objetos.find(p => p.id == idClickeado);

    if (!vehiculoAModificar) {
        console.error("No se encontró una persona con el ID: " + idClickeado);
        return;
    }

    cambiarVisibilidad();
    document.getElementById("formAbm").style.display = "";

    asignarValor("inputId", vehiculoAModificar.id || "");
    asignarValor("inputModelo", vehiculoAModificar.modelo || "");
    asignarValor("inputAnoFab", vehiculoAModificar.anoFab || "");
    asignarValor("inputVelMax", vehiculoAModificar.velMax || "");

    const divSelect = document.getElementById("divSelect");
    divSelect.style.display = "none";

    restablecerVisibilidadCampos();

    if (vehiculoAModificar instanceof Aereo) {
        document.getElementById("select").value = "Aereo";
        cambiarOpciones();
        document.getElementById("lblOpcional1").innerHTML = "Altura Maxima:";
        document.getElementById("lblOpcional2").innerHTML = "Automania:";

        ocultarCampos("lblOpcional3", "inputOpcional3", "lblOpcional4", "inputOpcional4");
    } else if (vehiculoAModificar instanceof Terrestre) {
        document.getElementById("select").value = "Terrestre";
        cambiarOpciones();
        document.getElementById("lblOpcional3").innerHTML = "Cantidad Puerta:";
        document.getElementById("lblOpcional4").innerHTML = "Cantidad Ruedas:";

        ocultarCampos("lblOpcional1", "inputOpcional1", "lblOpcional2", "inputOpcional2");
    }

    asignarValor("inputOpcional1", vehiculoAModificar.altMax);
    asignarValor("inputOpcional2", vehiculoAModificar.automania);
    asignarValor("inputOpcional3", vehiculoAModificar.cantPue);
    asignarValor("inputOpcional4", vehiculoAModificar.cantRue);

    document.getElementById("nuevo").style.display = "none";
    document.getElementById("modificar").style.display = "";
    document.getElementById("eliminar").style.display = "";
}

function asignarValor(idCampo, valor) {
    const campo = document.getElementById(idCampo);
    if (campo) {
        campo.value = valor || "";
    }
}

function restablecerVisibilidadCampos() {
    const campos = [
        "lblOpcional1", "inputOpcional1",
        "lblOpcional2", "inputOpcional2",
        "lblOpcional3", "inputOpcional3",
        "lblOpcional4", "inputOpcional4"
    ];

    campos.forEach(campo => {
        document.getElementById(campo).style.display = "";
    });
}

function ocultarCampos(...campos) {
    campos.forEach(campo => {
        document.getElementById(campo).style.display = "none";
    });
}

function limpiarCampos() {
    document.getElementById("inputId").value = "";
    document.getElementById("inputModelo").value = "";
    document.getElementById("inputAnoFab").value = "";
    document.getElementById("inputVelMax").value = "";
    document.getElementById("select").value = "Aereo"; // O cambia a "Cliente" según tu preferencia
    cambiarOpciones();
    document.getElementById("inputOpcional1").value = "";
    document.getElementById("inputOpcional2").value = "";
    document.getElementById("inputOpcional3").value = "";
    document.getElementById("inputOpcional4").value = "";
    document.getElementById("error").innerHTML = "";
    vehiculoAModificar = null;
}

//----------------------------------------TABLA-------------------------------------

let filtro = document.getElementById("filtro");
filtro.addEventListener("change", generarTabla);

let calcular = document.getElementById("calcularVelocidadMaxima");
calcular.addEventListener("click", calcularVelocidadMaxima);

let botonEliminar = document.getElementById("eliminar");
botonEliminar.addEventListener("click", eliminarVehiculo)

function calcularVelocidadMaxima() {
    let filtro = document.getElementById("filtro").value;

    const vehiculosFiltrados = objetos.filter(vehiculo => {
        switch (filtro) {
            case "Todos":
                return true;
            case "Aereo":
                return vehiculo instanceof Aereo;
            case "Terrestre":
                return vehiculo instanceof Terrestre;
            default:
                return true;
        }
    });

    const velocidadTotal = vehiculosFiltrados.reduce((valorAnterior, vehiculo) => {
        return valorAnterior + vehiculo.velMax; // Sumar la velocidad máxima (velMax)
    }, 0);

    let promedio = velocidadTotal / vehiculosFiltrados.length;

    let salida = document.getElementById("velocidadMax");
    salida.value = promedio;
}

function generarTabla() {
    limpiarTabla();
    let filtroTipo = filtro.value;

    let bodyTabla = document.getElementById("bodyTabla");
    let vehiculosMostradas = new Array();

    if (bodyTabla.childElementCount == 0) {
        objetos.forEach(vehiculo => {
            switch (filtroTipo) {
                case "Todos":
                    vehiculosMostradas.push(vehiculo);
                    break;
                case "Aereo":
                    (vehiculo instanceof Aereo) ? vehiculosMostradas.push(vehiculo) : null;
                    break;
                case "Terrestre":
                    (vehiculo instanceof Terrestre) ? vehiculosMostradas.push(vehiculo) : null;
                    break;
            }
        })
        insertarVehiculo(vehiculosMostradas);
    }
}

function insertarVehiculo(vehiculos) {
    let bodyTabla = document.getElementById("bodyTabla");
        
    vehiculos.forEach(vehiculo => {
        let arrayVehiculo = [vehiculo.id, vehiculo.modelo, vehiculo.anoFab, vehiculo.velMax, vehiculo.altMax, vehiculo.automania, vehiculo.cantPue, vehiculo.cantRue];
        let nuevoTr = document.createElement("tr")    
        nuevoTr.addEventListener("dblclick", cargarCampos)        
        nuevoTr.id = vehiculo.id;

        arrayVehiculo.forEach(atributo => {
            let td = document.createElement("td");
            td.id = "td" + arrayVehiculo[0] + "-" + atributo;
            td.textContent = atributo;
            nuevoTr.appendChild(td);
        });
        bodyTabla.appendChild(nuevoTr)
    })
}

function limpiarTabla() {
    let bodyTabla = document.getElementById("bodyTabla");
    bodyTabla.innerHTML = "";
    document.getElementById("velocidadMax").value = "";
}


let arrayShow = new Array();
arrayShow.push(document.getElementById("Col_id"), document.getElementById("Col_Modelo"),
        document.getElementById("Col_anoFab"), document.getElementById("Col_VelMax"),
        document.getElementById("Col_AltMax"), document.getElementById("Col_Autonomia"),
        document.getElementById("Col_CantPue"), document.getElementById("Col_CantRue"))            

arrayShow.map((check, index) => {
        check.addEventListener("change", cambiarVisibilidadCheck)
        check.textContent = index;
    });

function cambiarVisibilidadCheck(e)
{
    let checked = e.currentTarget;
    let colIndex = checked.textContent;
    let tableBody = document.querySelector("#bodyTabla");
    
    let tableHeadTr = document.getElementById("tableHeadTr");
    let childs = Array.from(tableHeadTr.childNodes)
    let tdHead = childs.filter(node => (node.nodeName == "TH" && node.cellIndex==colIndex)).pop();

    if(!checked.checked) 
    {
        tableBody.childNodes.forEach(tr => {
            tr.childNodes[colIndex].style.display="none";
        });

        tdHead.style.display="none";
        
    }else
    {
        tableBody.childNodes.forEach(tr => {
            tr.childNodes[colIndex].style.display="";
        });

        tdHead.style.display="";
    }
}

let arrayOrderBy = new Array();
arrayOrderBy.push(document.getElementById("orden_Id"),
        document.getElementById("orden_Modelo"),
        document.getElementById("orden_AnoFab"),
        document.getElementById("orden_VelMax"),
        document.getElementById("orden_AltMax"),
        document.getElementById("orden_Autonomia"),
        document.getElementById("orden_CantPuea"),
        document.getElementById("orden_CantRue")
        );

arrayOrderBy.forEach(input => { input.addEventListener("click", ordenar)});

let ordenado;

function ordenar()
{
    
    let atributo = event.target.id.split("orderBy")[1];                
    
    atributo = atributo[0].toLowerCase() + atributo.substring(1);                
    switch(ordenado)
    {                     
        case "descendente":            
            objetos.sort( (a, b) => a[atributo] ? (a[atributo] < b[atributo])? 1 : (b[atributo] == a[atributo]? 0 : -1) : ""); 
            ordenado = "ascendente";
            break;
        case "ascendente":
        default:
            objetos.sort( (a, b) => a[atributo] ? (a[atributo] > b[atributo])? 1 : (b[atributo] == a[atributo]? 0 : -1): "")
            ordenado = "descendente";
            break;           
    }
    
    generarTabla();
}


let body = document.getElementById("body");
body.addEventListener("load", cargaInicial());


function cargaInicial() {
    cambiarVisibilidad();
    generarTabla();
}
});
