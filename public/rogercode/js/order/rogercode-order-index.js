console.log("Starting");
const btnAddVentaDomicilio = document.querySelector("#btnAddVentaDomicilio");
const formCompensadoRes = document.querySelector("#form-compensado-res");
const token = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
const btnClose = document.querySelector("#btnModalClose");

const selectCategory = document.querySelector("#categoria");
const select2Cliente = document.querySelector("#cliente");
const selectCentrocosto = document.querySelector("#centrocosto");
const inputFactura = document.querySelector("#factura");
const sale_id = document.querySelector("#ventaId");
const contentform = document.querySelector("#contentDisable");

inputfecha_order = document.querySelector("#fecha_order");
inputfecha_entrega = document.querySelector("#fecha_entrega");
inputdireccion_envio = document.querySelector("#direccion_envio");
inputvendedor = document.querySelector("#vendedor");
inputsubcentrodecosto = document.querySelector("#subcentrodecosto");

inputhora_inicial_entrega = document.querySelector("#hora_inicial_entrega");

$(document).ready(function () {
    $(function () {
        $("#tableCompensado").DataTable({
            paging: true,
            pageLength: 50,
            /*"lengthChange": false,*/
            autoWidth: false,
            processing: true,
            serverSide: true,
            ajax: {
                url: "/showOrder",
                type: "GET",
            },
            columns: [
                { data: "id", name: "id" },
                {
                    data: "namethird",
                    name: "namethird",
                    render: function (data) {
                        if (data.length > 15) {
                            return data.substring(0, 7) + "...";
                        } else {
                            return data;
                        }
                    },
                },
                {
                    data: "namecentrocosto",
                    name: "namecentrocosto",
                    render: function (data) {
                        if (data.length > 5) {
                            return data.substring(0, 3) + "...";
                        } else {
                            return data;
                        }
                    },
                },
                /*   { data: "saresolucion", name: "saresolucion" }, */
                /*   { data: "ncresolucion", name: "ncresolucion" }, */
                { data: "status", name: "status" },
                {
                    data: "total_valor_a_pagar",
                    name: "total_valor_a_pagar",
                    render: function (data) {
                        return (
                            "$ " +
                            parseFloat(data).toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })
                        );
                    },
                },
                {
                    data: "total_utilidad",
                    name: "total_utilidad",
                    render: function (data) {
                        return (
                            "$ " +
                            parseFloat(data).toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })
                        );
                    },
                },
                { data: "date", name: "date" },
                { data: "date2", name: "date2" },

                /* { data: "resolucion", name: "resolucion" }, */
                
                {
                    data: "nombre_vendedor",
                    name: "nombre_vendedor",
                    render: function (data) {
                        if (data.length > 9) {
                            return data.substring(0, 9) + "...";
                        } else {
                            return data;
                        }
                    },
                },
                { data: "action", name: "action" },
            ],
            order: [[0, "DESC"]],
            language: {
                processing: "Procesando...",
                lengthMenu: "Mostrar _MENU_ registros",
                zeroRecords: "No se encontraron resultados",
                emptyTable: "Ningún dato disponible en esta tabla",
                sInfo: "Mostrando del _START_ al _END_ de total _TOTAL_ registros",
                infoEmpty:
                    "Mostrando registros del 0 al 0 de un total de 0 registros",
                infoFiltered: "(filtrado de un total de _MAX_ registros)",
                search: "Buscar:",
                infoThousands: ",",
                loadingRecords: "Cargando...",
                paginate: {
                    first: "Primero",
                    last: "Último",
                    next: "Siguiente",
                    previous: "Anterior",
                },
            },
        });
    });
    $(".select2Cliente").select2({
        placeholder: "Busca un cliente",
        width: "100%",
        theme: "bootstrap-5",
        allowClear: true,
    });
});

/* $(".select2Ventas").select2({
    placeholder: "Busca una factura",
    width: "100%",
    theme: "bootstrap-5",
    allowClear: true,
}); */

const send = async (dataform, ruta) => {
    let response = await fetch(ruta, {
        headers: {
            "X-CSRF-TOKEN": token,
        },
        method: "POST",
        body: dataform,
    });
    let data = await response.json();
    //console.log(data);
    return data;
};

const refresh_table = () => {
    let table = $("#tableCompensado").dataTable();
    table.fnDraw(false);
};
const showModalcreate = () => {
    if (contentform.hasAttribute("disabled")) {
        contentform.removeAttribute("disabled");
        $("#cliente").prop("disabled", false);
    }
    $("#cliente").val("").trigger("change");
    formCompensadoRes.reset();
    sale_id.value = 0;
};

const showDataForm = (id) => {
    console.log(id);
    const dataform = new FormData();
    dataform.append("id", id);
    send(dataform, "/saleById").then((resp) => {
        console.log(resp);
        console.log(resp.reg);
        showData(resp);
        $("#cliente").prop("disabled", true);
        contentform.setAttribute("disabled", "disabled");
    });
};

const editCompensado = (id) => {
    console.log(id);
    const dataform = new FormData();
    dataform.append("id", id);
    send(dataform, "/saleById").then((resp) => {
        console.log(resp);
        console.log(resp.reg);
        showData(resp);
        if (contentform.hasAttribute("disabled")) {
            contentform.removeAttribute("disabled");
            $("#cliente").prop("disabled", false);
        }
    });
};

const showData = (resp) => {
    let register = resp.reg;
    sale_id.value = register.id;
    /*  selectCategory.value = register.categoria_id; */
    $("#cliente").val(register.thirds_id).trigger("change");
    selectCentrocosto.value = register.centrocosto_id;
    /*    inputFactura.value = register.factura; */
    const modal = new bootstrap.Modal(
        document.getElementById("modal-create-compensado")
    );
    modal.show();
};

function Delivered(id) {
    swal({
        title: "CONFIRMAR",
        text: `¿ PEDIDO # ${id} FUE ENTREGADO ?`,
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "No",
        cancelButtonColor: "#fff",
        confirmButtonColor: "#3B3F5C",
        confirmButtonText: "Si",
    }).then(function (result) {
        if (result.value) {
            console.log(id);
            const waitOneSecond = async () => {
                let response = await fetch(`/delivered/${id}`);
                let resp = await response.json();
                console.log(resp);
                return resp;
            };
            waitOneSecond().then((resp) => {
                console.log(resp); //
                if (resp.status === 201) {
                    swal({
                        title: "Exito",
                        text: resp.message,
                        type: "success",
                    });
                    refresh_table();
                }
            });
        }
    });
}


function Reopen(id) {
    swal({
        title: "CONFIRMAR",
        text: `¿ SEGURO DE ABRIR REGISTRO # ${id} ?`,
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#fff",
        confirmButtonColor: "#3B3F5C",
        confirmButtonText: "Aceptar",
    }).then(function (result) {
        if (result.value) {
            console.log(id);
            const waitOneSecond = async () => {
                let response = await fetch(`/abrirOrden/${id}`);
                let resp = await response.json();
                console.log(resp);
                return resp;
            };
            waitOneSecond().then((resp) => {
                console.log(resp); //
                if (resp.status === 201) {
                    swal({
                        title: "Exito",
                        text: resp.message,
                        type: "success",
                    });
                    refresh_table();
                }
            });
        }
    });
}

function Confirm(id) {
    swal({
        title: "ADVERTENCIA",
        text: `¿ SEGURO DE ELIMINAR REGISTRO # ${id} ?`,
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#fff",
        confirmButtonColor: "#3B3F5C",
        confirmButtonText: "Aceptar",
    }).then(function (result) {
        if (result.value) {
            console.log(id);
            const waitOneSecond = async () => {
                let response = await fetch(`/downOrder/${id}`);
                let resp = await response.json();
                console.log(resp);
                return resp;
            };
            waitOneSecond().then((resp) => {
                console.log(resp); //
                if (resp.status === 201) {
                    swal({
                        title: "Exito",
                        text: resp.message,
                        type: "success",
                    });
                    refresh_table();
                }
            });
        }
    });
}

const downCompensado = (id) => {
    swal({
        title: "CONFIRMAR",
        text: "¿CONFIRMAS ELIMINAR EL REGISTRO?",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "Cerrar",
        cancelButtonColor: "#fff",
        confirmButtonColor: "#3B3F5C",
        confirmButtonText: "Aceptar",
    }).then(function (result) {
        if (result.value) {
            console.log(id);
            const dataform = new FormData();
            dataform.append("id", id);
            send(dataform, "/downnotacredito").then((resp) => {
                console.log(resp);
                refresh_table();
            });
        }
    });
};

const edit = async (id) => {
    console.log(id);
    const response = await fetch(`/order-edit/${id}`);
    const data = await response.json();
    console.log(data);
    if (contentform.hasAttribute("disabled")) {
        contentform.removeAttribute("disabled");

        $("#cliente").prop("disabled", false);
    }
    showForm(data);
};

/* inputdireccion_envio.value = resp.direccion_envio; */
/*    */

function convertirHora(hora24) {
    // Dividir la hora en horas y minutos
    var horaMinutos = hora24.split(":");

    // Obtener las horas y minutos
    var horas = parseInt(horaMinutos[0]);
    var minutos = horaMinutos[1];

    // Determinar si es "am" o "pm"
    var periodo = horas >= 12 ? "PM" : "AM";

    // Convertir a formato de 12 horas
    horas = horas % 12 || 12;

    // Anteponer un "0" si la hora es de un solo dígito
    horas = horas < 10 ? "0" + horas : horas;

    // Crear la cadena de la hora en formato de 12 horas
//  var hora12 = horas + ":" + minutos + " " + periodo;
    var hora12 = horas + ":" + minutos;


    return hora12;
}
//
const showForm = (data) => {
    let resp = data.ordenespedidos;
    console.log(resp);
    sale_id.value = resp.id;
    inputfecha_order.value = resp.fecha_order;
    $("#cliente").val(resp.third_id).trigger("change");
    $("#direccion_envio").val(resp.direccion_envio).trigger("change");
    $("#vendedor").val(resp.vendedor_id).trigger("change");
    $("#subcentrodecosto").val(resp.subcentrocostos_id).trigger("change");
    $("#alistador").val(resp.alistador_id).trigger("change");

    inputfecha_entrega.value = resp.fecha_entrega;
    $("#forma_de_pago").val(resp.formapago_id).trigger("change");
    $("#observacion").val(resp.observacion).trigger("change");

    // Convertir la hora inicial de entrega al formato de 12 horas
    var hora12 = convertirHora(resp.hora_inicial_entrega);

    // Establecer el valor de la hora inicial de entrega en formato de 12 horas
  //  $("#hora_inicial_entrega").val(hora12).trigger("change");

  //   inputhora_inicial_entrega.value = "03:30";

    console.log(hora12); // Salida: "03:30 pm"

    const modal = new bootstrap.Modal(
        document.getElementById("modal-create-compensado")
    );
    modal.show();
};

// Limpiar mensajes de error al cambiar el valor del campo
$('#direccion_envio').on('change', function() {
    $('.error-message').text('');
});

$('#hora_inicial_entrega').on('change', function() {
    $('.error-message').text('');
});

$('#hora_final_entrega').on('change', function() {
    $('.error-message').text('');
});

// Limpiar mensajes de error al cerrar la ventana modal
$('#modal-create-compensado').on('hidden.bs.modal', function () {
    $('.error-message').text('');
});

