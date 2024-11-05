$(document).ready(function(){

    //=====================
    // AFFICHAGE DU SELECT
    //=====================

    $.ajax({
        url: `${prefix_api}aliments.php`,

        method: "GET",

        dataType: "json"
    })

    .done(function(response){
        const alimentSelect = $('.libelle-aliment'); 
        alimentSelect.empty(); 

        response.forEach(aliment => {
            alimentSelect.append(new Option(aliment.LIBELLE_ALIMENT, aliment.ID_ALIMENT));
        });
    })

    .fail(function(error){
        alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
    });


    //================================
    // GESTION DE L'AJOUT D'UN INPUT
    //================================

    $("#ajout-repas").on("click", "#btn-ajout-aliment", function(event) {
        const currentRow = $(this).closest("tr");
    
        $(this).remove();
    
        const newRow = currentRow.clone();
    
        newRow.find("input[type='text']").val("");
    
        newRow.find("td:last").append('<button id="btn-ajout-aliment" type="button" class="cta">+</button>');
    
        currentRow.after(newRow);
    
        return false;
    });

    //===================================
    // GESTION DE L'ENVOI DU FORMULAIRE
    //===================================

    $('#ajout-repas').on("submit", function(event){
        event.preventDefault();

        const dateRepas = $("#date").val();
        const heureRepas = $("#time").val();

        const idsAliments = $(".libelle-aliment").map(function(){
            return $(this).val();
        }).get();

        const quantitesAliments = $(".quantite").map(function(){
            return $(this).val();
        }).get();

        let jsonDataRepas = JSON.stringify({
            dateRepas: dateRepas,
            heureRepas: heureRepas
        })

        $.ajax({
            url: `${prefix_api}repas.php`,
    
            method: "POST",

            data: jsonDataRepas,
    
            dataType:"json"
        })

        .done(function(response){
            // A COMPLETER
        })
        
        .fail(function(error){
            console.error("Erreur lors de la création de l'apport :", error);
        });
    })

})