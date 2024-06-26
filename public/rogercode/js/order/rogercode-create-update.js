import { sendData } from "../exportModule/core/rogercode-core.js";
import {
    successToastMessage,
    errorMessage,
} from "../exportModule/message/rogercode-message.js";
btnAddVentaDomicilio.addEventListener("click", async (e) => {
    e.preventDefault();
    const dataform = new FormData(formCompensadoRes);
    sendData("/ordersave", dataform, token).then((resp) => {
        console.log(resp);
        if (resp.status == 1) {
            formCompensadoRes.reset();
            btnClose.click();
            successToastMessage(resp.message);
            if (resp.registroId != 0) {
                //for new register
                window.location.href = `order/create/${resp.registroId}`;
            } else {
                refresh_table();
            }
        }
        if (resp.status == 0) {
            let errors = resp.errors;
            console.log(errors);
            $.each(errors, function (field, messages) {
                console.log(field, messages);
                let $input = $('[name="' + field + '"]');
                let $errorContainer = $input
                    .closest(".form-group")
                    .find(".error-message");
                $errorContainer.html(messages[0]);
                $errorContainer.show();
            });
        }
    });
});

$(document).ready(function() {
    $('#cliente').on('change', function() {
        var cliente_id = $(this).val();
        if (cliente_id) {
            $.ajax({
                url: '/getDireccionesByCliente/' + cliente_id,
                type: "GET",
                dataType: "json",
                success:function(data) {                  
                    $('#direccion_envio').empty();
                    $.each(data, function(key, value) {                     
                        $('#direccion_envio').append('<option value="'+ value.direccion +'">'+ value.direccion +'</option>')
                        $('#direccion_envio').append('<option value="'+ value.direccion1 +'">'+ value.direccion1 +'</option>');
                        $('#direccion_envio').append('<option value="'+ value.direccion2 +'">'+ value.direccion2 +'</option>');
                        $('#direccion_envio').append('<option value="'+ value.direccion3 +'">'+ value.direccion3 +'</option>');
                        $('#direccion_envio').append('<option value="'+ value.direccion4 +'">'+ value.direccion4 +'</option>');
                        $('#direccion_envio').append('<option value="'+ value.direccion5 +'">'+ value.direccion5 +'</option>');
                        $('#direccion_envio').append('<option value="'+ value.direccion6 +'">'+ value.direccion6 +'</option>');
                        $('#direccion_envio').append('<option value="'+ value.direccion7 +'">'+ value.direccion7 +'</option>');
                        $('#direccion_envio').append('<option value="'+ value.direccion8 +'">'+ value.direccion8 +'</option>');                        
                        $('#direccion_envio').append('<option value="'+ value.direccion9 +'">'+ value.direccion9 +'</option>');
                    });
                }
            });
        } else {         
            $('#direccion_envio').empty();
        }
    });
});

// Limpiar mensajes de error al cerrar la ventana modal
$('#modal-create-notacredito').on('hidden.bs.modal', function () {
    $('.error-message').text('');
});

// Limpiar mensajes de error al cambiar el valor del campo 
$('#direccion_envio').on('change', function() {
    $('.error-message').text('');
});

/* // Limpiar mensajes de error al limpiar el campo
$('#fecha_order, #centrocosto, #cliente, #factura, #vendedor, #subcentrodecosto').on('blur', function () {
    $(this).next('.error-message').text('');
}); */
/* 
// Limpiar mensajes de error al limpiar el campo
$('#fecha_order, #centrocosto, #cliente, #factura, #vendedor, #subcentrodecosto').on('focusout', function () {
    $(this).next('.error-message').text('');
});
 */
/* // Limpiar mensajes de error al limpiar el campo
$('#fecha_order, #centrocosto, #cliente, #factura').on('change', function () {
    $(this).next('.error-message').text('');
}); */

/* 
// Limpiar mensajes de error al limpiar el campo
$('#fecha_order, #centrocosto, #cliente, #factura, #vendedor, #subcentrodecosto').on('input', function () {
    $(this).next('.error-message').text('');
}); */


/* // Limpiar mensajes de error al limpiar el campo
$('#fecha_order, #centrocosto, #cliente, #factura, #vendedor, #subcentrodecosto').on('keyup', function () {
    $(this).next('.error-message').text('');
}); */