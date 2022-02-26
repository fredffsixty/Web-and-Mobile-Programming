$(document).ready(function() {
    const strongPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}");

    let province = null;

    let db = {}; // oggetto database che sarà popolato dopo la richiesta AJAX

    // chiamata per caricare il file del database di regioni, province e comuni
    $.ajax({
        // oggetto con le impostazioni della richiesta
        // $.ajax() restituisce un oggetto jqXHR che implementa l'interfaccia di Promise
        url: '/javascripts/regioni_province_comuni.json',
        dataType: 'json',
        type: 'GET',
        // imponiamo che la risposta sia JSON
        beforeSend: function(xhr) {
            xhr.overrideMimeType('application/json');
        },
        // success funzione da chiamare in caso di successo
        // ovvero si può usare .done(callback(data){...}) come metodo
        // di jqXHR che funziona come then()
        success: function(result, status, xhr) {
            console.log(`Status: ${status} ${xhr.statusText}`);
            console.log(`retrieved file: ${xhr.responseURL}`);
            console.log(`type: ${xhr.getResponseHeader('Content-Type')}`);
            localStorage.setItem('regionData', JSON.stringify(xhr.responseJSON));
            db = JSON.parse(localStorage.getItem('regionData'));
        }
    }).fail(function(error) {
        // sempre secondo la logica di Promise
        // in alternativa l'oggetto che configura $.ajax() accetta
        // un campo error che è la callback da chiamare in caso di errore
        console.log(error.message);
    });

    $('#address').focusout(function(ev) {
        if ($(this).val() != '') {
            $('.form-row input').not('#address').removeAttr('disabled');
            $('.form-row input').not('#address').attr('required', 'required');
        } else {
            $('.form-row input').not('#address').attr('disabled', 'disabled');
            $('.form-row input').not('#address').removeAttr('required');
        }
    }).keydown(function(ev) {
        if (ev.keyCode == 9) { // pressione TAB
            if ($(this).val() != '') {
                $('.form-row input').not('#address').removeAttr('disabled');
                $('.form-row input').not('#address').attr('required', 'required');
            } else {
                $('.form-row input').not('#address').attr('disabled', 'disabled');
                $('.form-row input').not('#address').removeAttr('required');
            }
        }
    });

    $('#repass').change(function(ev) {
        if ($(this).val() != $('#pass').val()) {
            $(this).val('').attr('placeholder', 'Password non coincidenti!').focus();
        }
    });

    $('#pass').on('input', function(ev) {

        if (strongPass.test($(this).val()))
            $(this).siblings('.valid-feedback').removeClass('text-warning').text('Password forte');
        else
            $(this).siblings('.valid-feedback').addClass('text-warning').text('Password media');
    });

    $('#region').change(function(ev) {
        // rimozione dei precedenti elementi del menu Provincia e Comune

        $('#state').html('<option value="" selected></option>');
        $('#town').html('<option value="" selected></option>');

        if ($(this).val() != '') {
            for (let regione of db.regioni) {
                if (regione.nome == $(this).val()) {
                    province = regione.province;
                    break;
                }
            }

            for (let provincia of province) {
                $(document.createElement('option')).
                val(provincia.nome).
                text(provincia.nome).
                appendTo('#state');
            }

        }
    });

    $('#state').change(function(ev) {
        // rimozione dei precedenti elementi del menu Comune

        $('#town').html('<option value="" selected></option>');

        if ($(this).val() != '') {

            for (let provincia of province) {
                if (provincia.nome == $('#state').val()) {
                    for (let comune of provincia.comuni) {

                        $(document.createElement('option')).
                        val(comune.nome).
                        text(comune.nome).
                        appendTo('#town');
                    }
                    break; // non dobbiamo cercare oltre
                }
            }
        }
    });

});