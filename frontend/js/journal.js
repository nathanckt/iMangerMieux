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
            const newId = response.id;
            for (let i = 0; i < idsAliments.length; i++) {
                const idAliment = idsAliments[i];
                const quantite = quantitesAliments[i];

                let jsonDataApport = JSON.stringify({
                    idRepas: newId,
                    idAliment: idAliment,
                    quantite: quantite
                });

                $.ajax({
                    url: `${prefix_api}contient.php`,
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
            console.error("Erreur lors de la création de l'apport :", error);
        });
    })

    //========================
    // AFFICHAGE DE LA TABLE 
    //========================

    let table;

    $.ajax({
        url: `${prefix_api}repas.php`,

        method: "GET",

        dataType: "json"
    })

    .done(function(response){
        table = $('.table').DataTable({
            data: response,
            columns: [
                { data: 'ID_REPAS' }, 
                { data: 'DATE' },    
                { 
                    data: 'ALIMENTS', 
                    render: function(data, type, row) {
                        // Combine les noms des aliments avec un point-virgule
                        return data.map(aliment => aliment.LIBELLE_ALIMENT).join('; ');
                    }
                },
                {
                    data: null, 
                    defaultContent: `
                             <button class="cta cta--small btn-edit" >Modifier</button>
                             <button class="cta cta--small btn-delete">Supprimer</button>
                         `,
                    target: -1
                }
            ]
        });

    })

    .fail(function(error){
        alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
    });


    //====================
    // GESTION SUPPRIMER
    //====================

    $('.table').on('click', '.btn-delete', function() {
        let row = $(this).closest('tr');
        let repasId = $(this).closest('tr').find('td.dt-type-numeric').text();

        $.ajax({
            url: `${prefix_api}repas.php?id=${repasId}`,

            method: "DELETE", 

            dataType: "json"
        })

        .done(function(response){
            table.row(row).remove().draw();
        })

        .fail(function(error){
            alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
        });
        
    });

})