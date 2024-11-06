$(document).ready(function(){

    let listeAliments;
    let editModif = false;
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
        if(!editModif){
            
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
            
            console.log(jsonDataRepas);
            $.ajax({
                url: `${prefix_api}repas.php`,
                method: "POST",
                data: jsonDataRepas,
                contentType: "application/json",
                dataType:"json"
            })
            .done(function(response){
                console.log("yeahh");
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
        }
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

    let numberOfAliments = 0;
    let idRepasModif = 0;

    $('.table').on('click', '.btn-edit', function() {
        const row = $(this).closest('tr'); 
        const repasId = row.find('td:first').text();
        idRepasModif = repasId;
        editModif = true;

        $.ajax({
            url: `${prefix_api}repas.php?id_repas=${repasId}`,
            method: "GET",
            dataType: "json"
        })
        .done(function(repas) {
            const repasData = repas; 
            console.log(repasData);

            $("#date").val(repasData.DATE.split(" ")[0]); 
            $("#time").val(repasData.DATE.split(" ")[1]);

            $("#ajout-repas .libelle-aliment").empty();
            $("#ajout-repas .quantite").empty();
        
            if (Array.isArray(repasData.ALIMENTS)) {
                repasData.ALIMENTS.forEach((aliment, index) => {
                    numberOfAliments = numberOfAliments + 1;
                    if (index === 0) {
                        const alimentSelect = $('.libelle-aliment'); 
                        alimentSelect.empty(); 

                        listeAliments.forEach(aliment => {
                        alimentSelect.append(new Option(aliment.LIBELLE_ALIMENT, aliment.ID_ALIMENT));
                        });
                        $(".libelle-aliment").val(aliment.ID_ALIMENT);
                        $(".quantite").val(aliment.QUANTITE);
                    } else {
                        const newRow = $("#ajout-repas table tr").eq(1).clone();
                        newRow.find(".libelle-aliment").val(aliment.ID_ALIMENT);
                        newRow.find(".quantite").val(aliment.QUANTITE);
                        $("#btn-ajout-aliment").remove();
                        //$('#ajout-repas input[type="submit"]').remove();
                        $("#ajout-repas table").find('tr:last').after(newRow);
                    }
                    $('#ajout-repas input[type="submit"]').remove();
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

    //============================
    // GESTION DE L'ENVOI MODIFIÉ
    //============================

    $('#ajout-repas').on("submit", function(event) {
        if(editModif){
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
                idRepas: idRepasModif,  
            });
    
            $.ajax({
                url: `${prefix_api}repas.php`,
                method: "PUT",
                data: jsonDataRepas,
                contentType: "application/json",
                dataType: "json"
            })
            .done(function(response) {
                // BOUCLE => Les x premiers en UPDATE le reste en POST
                for (let i = 0; i < idsAliments.length; i++) {
                    const idAliment = idsAliments[i];
                    const quantite = quantitesAliments[i];
    
                    let jsonDataApport = JSON.stringify({
                        idRepas: idRepasModif,
                        idAliment: idAliment,
                        quantite: quantite,
                    });

                    console.log(jsonDataApport);
                    if(i < numberOfAliments){
                        $.ajax({
                    
                            url: `${prefix_api}contient.php`,
                            method: "PUT",
                            data: jsonDataApport,
                            contentType: "application/json",
                            dataType: "json"
                        })
                        .done(function(response){
                            console.log("Apport mis à jour avec succès pour l'aliment ID :", idRepasModif);
                        })
                        .fail(function(error){
                            console.error("Erreur lors de la mise à jour de l'apport :", error);
                        });
                    }
                    else{
                        console.log('là');
                        $.ajax({
                            url: `${prefix_api}contient.php`,
                            method: "POST",
                            data: jsonDataApport,
                            contentType: "application/json",
                            dataType: "json"
                        })
                        .done(function(response){
                            console.log("Apport créé avec succès pour l'aliment ID :", idRepasModif);
                        })
                        .fail(function(error){
                            console.error("Erreur lors de la création de l'apport :", error);
                        });
                    }
                }
    
                
                    // $("#ajout-repas")[0].reset();
                    // $('#ajout-repas input[type="submit"]').val("Créer un aliment");
                    // $('section.ajout h1').text("Ajouter un repas");
                    // $("#ajout-repas").removeData("editMode").removeData("repasId");
                    // table.ajax.reload();
                
            })
            .fail(function(error) {
                alert("Erreur lors de l'enregistrement du repas :" + JSON.stringify(error));
            });
        }
        editModif = false;
    });


    //==================================
    // RECUPERATION DES DONNEES SEMAINE
    //==================================

    let listeRepasSemaine;
    let allAlimentIDs = [];
    let listeAlimentsSemaine;
    const currentDate = new Date();

    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - 7);

    $.ajax({
        url: `${prefix_api}repas.php?by_login=*`,
        method: "GET",
        dataType: "json"
    })
    .done(function(response){
        listeRepasSemaine = response.filter(repas => {
            const repasDate = new Date(repas.DATE);
            return repasDate >= startDate && repasDate <= currentDate;
        });
        if (Array.isArray(listeRepasSemaine)) {
            listeRepasSemaine.forEach(function(repasItem) {
                if (Array.isArray(repasItem.ALIMENTS)) {
                    repasItem.ALIMENTS.forEach(function(aliment) {
                        allAlimentIDs.push(aliment.ID_ALIMENT);
                    });
                }
            });
        } else {
            console.log("Le tableau 'repas' n'est pas défini correctement.");
        }

        // RECUPERATION DES NUTRIMENTS
        $.ajax({
            url: `${prefix_api}aliments.php?populate=*`,  // Remplacez par l'URL de votre API
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log(data);
                listeAliments = data.filter(function(aliment) {
                    return allAlimentIDs.includes(parseInt(aliment.ID_ALIMENT));  // Vérifie si l'ID de l'aliment est dans la liste alimentIds
                });
        
                // Affiche les aliments filtrés
                console.log("ici");
                console.log(listeAliments);
            },
            error: function(xhr, status, error) {
                console.error('Erreur lors de la requête :', error);
            }
        });
        
    })
    .fail(function(error){
        alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
    });
    


    //===========================
    // AFFICHAGE DES GRAPHIQUES
    //===========================

    am5.ready(function() {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("chartdiv");
        
        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
          am5themes_Animated.new(root)
        ]);
        
        // Create chart
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
        var chart = root.container.children.push(
          am5percent.PieChart.new(root, {
            endAngle: 270
          })
        );
        
        // Create series
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
        var series = chart.series.push(
          am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "category",
            endAngle: 270
          })
        );
        
        series.states.create("hidden", {
          endAngle: -90
        });
        
        // Set data
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
        series.data.setAll([{
          category: "Lithuania",
          value: 501.9
        }, {
          category: "Czechia",
          value: 301.9
        }, {
          category: "Ireland",
          value: 201.1
        }, {
          category: "Germany",
          value: 165.8
        }, {
          category: "Australia",
          value: 139.9
        }, {
          category: "Austria",
          value: 128.3
        }, {
          category: "UK",
          value: 99
        }]);
        
        series.appear(1000, 100);
        
        }); // end am5.ready();

});

