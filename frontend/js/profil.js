$(document).ready(function(){
    
    //===========================
    // RECUPERATION DES DONNEES
    //===========================

    // UTILISATEUR
    $.ajax({
        url: `${prefix_api}users.php?login=*`,

        method: "GET",

        dataType:"json"
    })

    .done(function(response){
        $('#nom').text(response.NOM);
        $('#prenom').text(response.PRENOM);
        $('#naissance').text(response.DATE_DE_NAISSANCE);
        $('#tranche').text(response.LIBELLE_TRANCHE);
        $('#sexe').text(response.LIBELLE_SEXE);
        $('#sport').text(response.LIBELLE_SPORT);
        $('#mail').text(response.MAIL);
    })

    .fail(function(error){
        alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
    });

    let libelleSexeArray = [];
    let libelleSportArray = [];
    let libelleTrancheArray = [];

    //SEXE
    $.ajax({
        url: `${prefix_api}sexe.php`,

        method: "GET",

        dataType:"json"
    })

    .done(function(response){
        libelleSexeArray = response.map(item => item.LIBELLE_SEXE);
    })

    .fail(function(error){
        alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
    });

    //SPORT
    $.ajax({
        url: `${prefix_api}sport.php`,

        method: "GET",

        dataType:"json"
    })

    .done(function(response){
        libelleSportArray = response.map(item => item.LIBELLE_SPORT);
    })

    .fail(function(error){
        alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
    });

    //TRANCHE
    $.ajax({
        url: `${prefix_api}age.php`,

        method: "GET",

        dataType:"json"
    })

    .done(function(response){
        libelleTrancheArray = response.map(item => item.LIBELLE_TRANCHE);
    })

    .fail(function(error){
        alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
    });

    //============================
    // GESTION DE LA MODIFICATION
    //============================

    $('.infos-user').on("click",".btn-modif", function(){
        $(this).text('Envoyer').removeClass('btn-modif').addClass('btn-send');

        $('.infos-user p').each(function(){
            const id = $(this).attr('id');

            if(id === 'sexe' || id === 'sport' || id === 'tranche'){

                const selectOptions = {
                    'sexe': libelleSexeArray,
                    'sport': libelleSportArray,
                    'tranche': libelleTrancheArray
                };// a modif pour correspondre à la BDD

                let select = $('<select></select>').attr('id', id);
                selectOptions[id].forEach(option => {
                    $('<option></option>').val(option).text(option).appendTo(select);
                });

                $(this).replaceWith(select);
            } else {
                const input = $('<input type="text">').attr('id', id).val($(this).text());
                $(this).replaceWith(input);
            }
        })


    });

    $('.infos-user').on("click",".btn-send", function(){
        $(this).text('Modifier').removeClass('btn-send').addClass('btn-modif');

        nom = $('#nom').val();
        console.log(nom);
        prenom = $('#prenom').val();
        naissance = $('#naissance').val();
        tranche = libelleTrancheArray.indexOf($('#tranche').val())+1;
        sexe = libelleSexeArray.indexOf($('#sexe').val())+1;
        sport = libelleSportArray.indexOf($('#sport').val())+1;
        mail = $('#mail').val();

        let jsonData = JSON.stringify({
            NOM : nom, 
            PRENOM : prenom,
            MAIL : mail,
            DATE_DE_NAISSANCE : naissance,
            ID_SPORT : sport,
            ID_SEXE: sexe,
            ID_TRANCHE: tranche
        })

        // requete pour update
        $.ajax({
            url: `${prefix_api}users.php`,
    
            method: "PUT",

            data: jsonData,
    
            dataType:"json"
        })
    
        .done(function(response){
            location.reload();
        })
    
        .fail(function(error){
            alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
        });
    });
})