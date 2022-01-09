//JQUERY
let carrito = [];
let productosJSON = [];

$(document).ready(function () {
    $("#fila_prueba").css({ background: "#00BFA6", color: "white" });
    obtenerJSON();
    //selector y evento change
    $("#miSeleccion option[value='pordefecto']").attr("selected", true);
    $("#miSeleccion").on("change", ordenar);
});


function renderizarProductos() {
    //renderizamos los productos 
    for (const prod of productosJSON) {
        $(".milista").append(`<li class="list-group-item">
        <h3>ID: ${prod.id}</h3>
        <img src="${prod.foto}" width="250px" height="250px">
        <p>Producto: ${prod.nombre}</p>
        <p>Precio $ ${prod.precio}</p>
        <button class="btn btn-secondary" id='btn${prod.id}'>COMPRAR</button>
    </li>`);

        //Evento para cada boton
        $(`#btn${prod.id}`).on('click', function () {
            agregarACarrito(prod);
        });
    }
}

class ProductoCarrito {
    constructor(objProd) {
        this.id = objProd.id;
        this.foto = objProd.foto;
        this.nombre = objProd.nombre;
        this.precio = objProd.precio;
        this.cantidad = 1;
    }
}

function agregarACarrito(productoNuevo) {
    let encontrado = carrito.find(p => p.id == productoNuevo.id);
    console.log(encontrado);
    if (encontrado == undefined) {
        let prodACarrito = new ProductoCarrito(productoNuevo);
        carrito.push(prodACarrito);
        console.log(carrito);
        Swal.fire(
            'Nuevo producto agregado al carro',
            productoNuevo.nombre,
            'success'
        );
        //agregamos una nueva fila a la tabla de carrito
        $("#tablabody").append(`
            <tr id='fila${prodACarrito.id}'>
            <td> ${prodACarrito.id} </td>
            <td> ${prodACarrito.nombre}</td>
            <td id='${prodACarrito.id}'> ${prodACarrito.cantidad}</td>
            <td> ${prodACarrito.precio}</td>
            `);
    } else {
        //pido al carro la posicion del producto 
        let posicion = carrito.findIndex(p => p.id == productoNuevo.id);
        console.log(posicion);
        carrito[posicion].cantidad += 1;
        $(`#${productoNuevo.id}`).html(carrito[posicion].cantidad);
    }
    $("#gastoTotal").html(`Total: $ ${calcularTotal()}`);
    localStorage.setItem("carrito", JSON.stringify(carrito))
}



function calcularTotal() {
    let suma = 0;
    for (const elemento of carrito) {
        suma = suma + (elemento.precio * elemento.cantidad);
    }
    return suma;
}

function ordenar() {
    let seleccion = $("#miSeleccion").val();
    if (seleccion == "menor") {
        productosJSON.sort(function (a, b) {
            return a.precio - b.precio
        });
    } else if (seleccion == "mayor") {
        productosJSON.sort(function (a, b) {
            return b.precio - a.precio
        });
    } else if (seleccion == "alfabetico") {
        productosJSON.sort(function (a, b) {
            return a.nombre.localeCompare(b.nombre);
        });
    }
    $("li").remove();
    renderizarProductos();
}

//GETJSON de productos.json
function obtenerJSON() {
    $.getJSON("/productos.json", function (respuesta, estado) {
        if (estado == "success") {
            productosJSON = respuesta;
            renderizarProductos();
        }
    })
}



//Evento para finalizar compra
$("#botonFinalizarCompra").click(function () {
    Swal.fire("Finalizaste la compra, el total es: $" + calcularTotal());
})



