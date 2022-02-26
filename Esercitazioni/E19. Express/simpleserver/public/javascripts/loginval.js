$(document).ready(function() {
    const strongPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}");


    $('#pass').on('input', function(ev) {

        if (strongPass.test($(this).val()))
            $(this).siblings('.valid-feedback').removeClass('text-warning').text('Password forte');
        else
            $(this).siblings('.valid-feedback').addClass('text-warning').text('Password media');
    });

});