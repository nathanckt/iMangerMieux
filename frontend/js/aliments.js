$(document).ready(function(){

    let table;

    //==========================
    //  AFFICHAGE DES DONNEES
    //==========================

    $.ajax({
        url: "http://localhost:8888/iMangerMieux/backend/api/aliments.php",

        method: "GET",

        dataType: "json"
    })

    .done(function(response){
        table = $('.table').DataTable({
            data: response,
            columns: [
                { data: 'ID_ALIMENT' },    
                { data: 'LIBELLE_ALIMENT' },   
                { data: 'LIBELLE_TYPE' }, 
                {
                    data: null, 
                    defaultContent: `
                             <button class="cta cta--small btn-details" >Détails</button>
                         `,
                    target: -1
                }
            ]
        });

    })

    .fail(function(error){
        alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
    });

    //=====================
    // GESTION DE L'AJOUT
    //=====================

    // Remplissage du select type
    $.ajax({
        url: `${prefix_api}type.php`,

        method: "GET",

        dataType: "json"
    })

    .done(function(response){
        const typeSelect = $('#type'); 
        typeSelect.empty(); 

        response.forEach(type => {
            typeSelect.append(new Option(type.LIBELLE_TYPE, type.ID_TYPE));
        });
    })

    .fail(function(error){
        alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
    });

    // Remplissage du select 
    $.ajax({
        url: `${prefix_api}nutriments.php`,

        method: "GET",

        dataType: "json"
    })

    .done(function(response){
        const nutrimentSelect = $('.libelle-nutri'); 
        nutrimentSelect.empty(); 

        response.forEach(nutriment => {
            nutrimentSelect.append(new Option(nutriment.LIBELLE_APPORT, nutriment.ID_APPORT));
        });
    })

    .fail(function(error){
        alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
    });


    // Ajout d'une ligne supplémentaire 
    $("#ajout-aliment").on("click", "#btn-ajout-nutriment", function(event) {
        const currentRow = $(this).closest("tr");
    
        $(this).remove();
    
        const newRow = currentRow.clone();
    
        newRow.find("input[type='text']").val("");
    
        newRow.find("td:last").append('<button id="btn-ajout-nutriment" type="button" class="cta">+</button>');
    
        currentRow.after(newRow);
    
        return false;
    });


    // Gestion de l'envoi du formulaire 
    $('#ajout-aliment').on('submit', function(event){
        event.preventDefault();
        
        const libelleAliment = $("#libelle").val();
        const typeAliment = $("#type").val();

        const idsNutriments = $(".libelle-nutri").map(function() {
            return $(this).val();
        }).get(); 
        
        const pourcentageNutriments = $(".pourcentage-nutri").map(function() {
            return $(this).val();
        }).get(); 

        let jsonDataAliment = JSON.stringify({
            libelleAliment : libelleAliment, 
            idType : typeAliment
        })

        $.ajax({
            url: `${prefix_api}aliments.php`,
    
            method: "POST",

            data: jsonDataAliment,
    
            dataType:"json"
        })
    
        .done(function(response){
            const newId = response.id;
            for (let i = 0; i < idsNutriments.length; i++) {
                const idNutriment = idsNutriments[i];
                const pourcentage = pourcentageNutriments[i];

                let jsonDataApport = JSON.stringify({
                    idAliment: newId,
                    idApport: idNutriment,
                    pourcentage: pourcentage
                });

                $.ajax({
                    url: `${prefix_api}nutriments.php`,
                    method: "POST",
                    data: jsonDataApport,
                    contentType: "application/json",
                    dataType: "json"
                })
                .done(function(response){
                    console.log("Apport créé avec succès pour l'aliment ID :", newId);
                })
                .fail(function(error){
                    console.error("Erreur lors de la création de l'apport :", error);
                });
            }
        })
    
        .fail(function(error){
            alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
        });
    })
    
});
