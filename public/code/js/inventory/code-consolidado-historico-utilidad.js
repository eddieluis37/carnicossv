const token = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

var dataTable;

function initializeDataTable(
    centrocostoId = "-1",
    categoriaId = "-1",
    fechai = "2000-01-01",
    fechaf = "2000-01-01"
) {
    dataTable = $("#tableHistutilidad").DataTable({
        paging: true,
        pageLength: 500,
        autoWidth: false,
        processing: true,
        serverSide: true,
        scrollX: true,
        ajax: {
            url: "showhistutilidad",
            type: "GET",
            data: {
                centrocostoId: centrocostoId,
                categoriaId: categoriaId,
                fechai: fechai,
                fechaf: fechaf,
            },
        },
        columns: [
            { data: "namecategoria", name: "namecategoria" },
            {
                data: "nameproducto",
                name: "nameproducto",
                render: function (data) {
                    let subStringData = data.substring(0, 25).toLowerCase();
                    let capitalizedSubString =
                        subStringData.charAt(0).toUpperCase() +
                        subStringData.slice(1);
                    if (data.length > 25) {
                        return `<span style="font-size: smaller;" title="${data}">${capitalizedSubString}.</span>`;
                    } else {
                        /*   return `<span style="font-size: smaller;">${data.toLowerCase()}</span>`; */
                        return `<span style="font-size: smaller;">${capitalizedSubString}</span>`;
                    }
                },
            },
            { data: "fecha", name: "fecha" },
            { data: "consecutivo", name: "consecutivo" },
            { data: "invinicial", name: "invinicial" },
            { data: "compraLote", name: "compraLote" },
            { data: "compensados", name: "compensados" },
            { data: "trasladoing", name: "trasladoing" },
            { data: "trasladosal", name: "trasladosal" },
            { data: "venta", name: "venta" },
            { data: "notacredito", name: "notacredito" },
            { data: "notadebito", name: "notadebito" },

            {
                data: null,
                name: "disponible",
                render: function (data, type, row) {
                    var invinicial = parseFloat(row.invinicial);
                    var compraLote = parseFloat(row.compraLote);
                    var compensados = parseFloat(row.compensados);
                    var trasladoing = parseFloat(row.trasladoing);
                    var disponible =
                        invinicial + compraLote + compensados + trasladoing;
                    return disponible.toFixed(2);
                },
            },

            {
                data: null,
                name: "merma",
                render: function (data, type, row) {
                    var merma = row.notacredito - row.notacredito;
                    var mermaFormatted = merma.toFixed(2);
                    if (merma < 0) {
                        return (
                            '<span style="color: red;">' +
                            mermaFormatted +
                            "</span>"
                        );
                    } else {
                        return mermaFormatted;
                    }
                },
            },

            {
                data: null,
                name: "pmerma",
                render: function (data, type, row) {
                    var merma = row.notacredito - row.notacredito;
                    var invinicial = parseFloat(row.invinicial);
                    var compraLote = parseFloat(row.compraLote);
                    var compensados = parseFloat(row.compensados);
                    var trasladoing = parseFloat(row.trasladoing);
                    var disponible =
                        invinicial + compraLote + compensados + trasladoing;
                    var pmerma = (merma / disponible) * 100;
                    if (isNaN(pmerma) || !isFinite(pmerma)) {
                        pmerma = 0;
                    }
                    var pmermaFormatted = pmerma.toFixed(2) + "%";
                    if (pmerma < 0) {
                        return (
                            '<span style="color: red;">' +
                            pmermaFormatted +
                            "</span>"
                        );
                    } else {
                        return pmermaFormatted;
                    }
                },
            },
        ],
        order: [[1, "ASC"]],
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
        dom: "Bfrtip",
        buttons: ["copy", "csv", "excel", "pdf"],
        footerCallback: function (row, data, start, end, display) {
            var api = this.api();

            // Totalizar la columna "invinicial"
            var totalInvinicial = api
                .column("invinicial:name", { search: "applied" })
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0)
                .toFixed(2);

            // Totalizar la columna "compraLote"
            var totalCompraLote = api
                .column("compraLote:name", { search: "applied" })
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0)
                .toFixed(2);

            // Totalizar la columna "compensados"
            var totalCompensados = api
                .column("compensados:name", { search: "applied" })
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0)
                .toFixed(2);

            // Totalizar la columna "trasladoing"
            var totalTrasladoing = api
                .column("trasladoing:name", { search: "applied" })
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0)
                .toFixed(2);

            // Totalizar la columna "trasladosal"
            var totalTrasladosal = api
                .column("trasladosal:name", { search: "applied" })
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0)
                .toFixed(2);

            // Totalizar la columna "venta"
            var totalVenta = api
                .column("venta:name", { search: "applied" })
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0)
                .toFixed(2);

            // Totalizar la columna "notacredito"
            var totalStock = api
                .column("notadebito:name", { search: "applied" })
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0)
                .toFixed(2);

            // Totalizar la columna "notacredito"
            var totalFisico = api
                .column("notacredito:name", { search: "applied" })
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0)
                .toFixed(2);

            // Totalizar la columna "disponible"
            var totalDisponible = api
                .column("disponible:name", { search: "applied" })
                .data()
                .reduce(function (a, b) {
                    var value = parseFloat(b);
                    return isNaN(value) ? a : a + value;
                }, 0)
                .toFixed(2);

            // Agregar los valores totales en el footer
            $(api.column("invinicial:name").footer()).html(totalInvinicial);
            $(api.column("compraLote:name").footer()).html(totalCompraLote);
            $(api.column("compensados:name").footer()).html(totalCompensados);
            $(api.column("trasladoing:name").footer()).html(totalTrasladoing);
            $(api.column("trasladosal:name").footer()).html(totalTrasladosal);
            $(api.column("venta:name").footer()).html(totalVenta);
            $(api.column("notadebito:name").footer()).html(totalStock);
            $(api.column("notacredito:name").footer()).html(totalFisico);
            $(api.column("disponible:name").footer()).html(totalDisponible);
        },
    });
}

function cargarTotales(
    centrocostoId = "-1",
    categoriaId = "-1",
    fechai = "2000-01-01",
    fechaf = "2000-01-01"
) {
    $.ajax({
        type: "GET",
        url: "/totaleshistutilidad",
        data: {
            centrocostoId: centrocostoId,
            categoriaId: categoriaId,
            fechai: fechai,
            fechaf: fechaf,
        },
        dataType: "JSON",
        success: function (data) {
            $("#totalStock").html(data.totalStock);
            $("#totalInvInicial").html(data.totalInvInicial);

            $("#totalCompraLote").html(data.totalCompraLote);
            $("#totalCompensados").html(data.totalCompensados);
            $("#totalTrasladoing").html(data.totalTrasladoing);

            $("#totalVenta").html(data.totalVenta);
            $("#totalTrasladoSal").html(data.totalTrasladoSal);

            $("#totalIngresos").html(data.totalIngresos);
            $("#totalSalidas").html(data.totalSalidas);

            $("#totalConteoFisico").html(data.totalConteoFisico);

            $("#diferenciaKilos").html(data.diferenciaKilos);
            $("#difKilosPermitidos").html(data.difKilosPermitidos);
            $("#porcMerma").html(data.porcMerma);
            $("#porcMermaPermitida").html(data.porcMermaPermitida);
            $("#difKilos").html(data.difKilos);
            $("#difPorcentajeMerma").html(data.difPorcentajeMerma);
        },
    });
}

$(document).ready(function () {
    initializeDataTable("-1");

    $("#centrocosto, #categoria,#fechainicial,#fechafinal").on(
        "change",
        function () {
            var centrocostoId = $("#centrocosto").val();
            var categoriaId = $("#categoria").val();
            var fechainicial = $("#fechainicial").val();
            var fechafinal = $("#fechafinal").val();

            dataTable.destroy();
            initializeDataTable(
                centrocostoId,
                categoriaId,
                fechainicial,
                fechafinal
            );
            cargarTotales(centrocostoId, categoriaId, fechainicial, fechafinal);
        }
    );
});
