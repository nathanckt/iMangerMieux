$(document).ready(function(){

    let listeAliments;
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

        listeAliments = response;

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
        });

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
    });

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
                        return data.map(aliment => aliment.LIBELLE_ALIMENT).join('; ');
                    }
                },
                {
                    data: null, 
                    defaultContent: `
                        <button class="cta cta--small btn-edit">Modifier</button>
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
        let repasId = row.find('td:first').text();

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

    //====================
    // GESTION MODIFIER
    //====================

    $('.table').on('click', '.btn-edit', function() {
        const row = $(this).closest('tr');
        const repasId = row.find('td:first').text();

        $.ajax({
            url: `${prefix_api}repas.php?id=${repasId}`,
            method: "GET",
            dataType: "json"
        })
        .done(function(repas) {
            const repasData = repas[0]; 

            $("#date").val(repasData.DATE.split(" ")[0]); 
            $("#time").val(repasData.DATE.split(" ")[1]);

            $("#ajout-repas .libelle-aliment").empty();
            $("#ajout-repas .quantite").empty();
        
            if (Array.isArray(repasData.ALIMENTS)) {
                repasData.ALIMENTS.forEach((aliment, index) => {
                    if (index === 0) {
                        const alimentSelect = $('.libelle-aliment'); 
                        alimentSelect.empty(); 

                        listeAliments.forEach(aliment => {
                        alimentSelect.append(new Option(aliment.LIBELLE_ALIMENT, aliment.ID_ALIMENT));
                        });
                        $(".quantite").val(aliment.QUANTITE);
                    } else {
                        const newRow = $("#ajout-repas table tr").eq(1).clone();
                        newRow.find(".libelle-aliment").val(aliment.ID_ALIMENT);
                        newRow.find(".quantite").val(aliment.QUANTITE);
                        $("#btn-ajout-aliment").remove();
                        $('#ajout-repas input[type="submit"]').remove();
                        $("#ajout-repas table").find('tr:last').after(newRow);
                    }
                });
            } else {
                console.warn("Aucun aliment trouvé pour ce repas.");
            }
            $('section.ajout h1').text("Modifier un repas");
            const newRow = `
            <tr>
                <th></th>
                <td><input type="submit" value="Créer un aliment"/></td>
            </tr>
        `;

            // Ajouter la nouvelle ligne à la table
            $("#ajout-repas table").append(newRow);
    
            $('#ajout-repas input[type="submit"]').val("Modifier le repas");
            $("#ajout-repas").data("editMode", true).data("repasId", repasData.ID_REPAS);
        })
        .fail(function(error) {
            alert("Erreur lors de la récupération des données du repas :" + JSON.stringify(error));
        });
        
        
    });

    //=========================
    // GESTION DE L'ENVOI MODIFIÉ
    //=========================

    $('#ajout-repas').on("submit", function(event) {
        event.preventDefault();

        const dateRepas = $("#date").val();
        const heureRepas = $("#time").val();
        const idsAliments = $(".libelle-aliment").map(function() {
            return $(this).val();
        }).get();
        const quantitesAliments = $(".quantite").map(function() {
            return $(this).val();
        }).get();

        const jsonDataRepas = JSON.stringify({
            dateRepas: dateRepas,
            heureRepas: heureRepas,
            aliments: idsAliments.map((id, index) => ({
                idAliment: id,
                quantite: quantitesAliments[index]
            }))
        });

        const isEditMode = $(this).data("editMode");
        const url = isEditMode ? `${prefix_api}repas.php?id=${$(this).data("repasId")}` : `${prefix_api}repas.php`;
        const method = isEditMode ? "PUT" : "POST";

        $.ajax({
            url: url,
            method: method,
            data: jsonDataRepas,
            contentType: "application/json",
            dataType: "json"
        })
        .done(function(response) {
            alert(isEditMode ? "Repas modifié avec succès !" : "Repas ajouté avec succès !");
            if (isEditMode) {
                $("#ajout-repas")[0].reset();
                $('#ajout-repas input[type="submit"]').val("Créer un aliment");
                $('section.ajout h1').text("Ajouter un repas");
                $("#ajout-repas").removeData("editMode").removeData("repasId");
                table.ajax.reload();
            } else {
                table.ajax.reload();
            }
        })
        .fail(function(error) {
            alert("Erreur lors de l'enregistrement du repas :" + JSON.stringify(error));
        });
    });


});
