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
                
            })
            .fail(function(error) {
                alert("Erreur lors de l'enregistrement du repas :" + JSON.stringify(error));
            });
        }
        editModif = false;
    });


    //===================================
    // INITIALISATION DE totalNutriments
    //===================================

    // Liste des nutriments d'intérêt
    const nutrimentsInteret = [
        "Protéines N x facteur de Jones (g/100 g)",
        "Sucres (g/100 g)",
        "Glucides (g/100 g)",
        "Lipides (g/100 g)",
        "AG saturés (g/100 g)",
        "Eau (g/100 g)"
    ];

    // Initialisation des sommes de chaque nutriment d'intérêt
    let totalNutriments = nutrimentsInteret.map(nutriment => ({
        category: nutriment,
        value: 0
    }));

    //==================================
    // RECUPERATION DES DONNEES SEMAINE
    //==================================

    let listeRepasSemaine;
    let allAlimentIDs = [];
    let quantiteAliment = [];
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
                        quantiteAliment.push(aliment.QUANTITE);
                    });
                }
            });
        } else {
            console.log("Le tableau 'repas' n'est pas défini correctement.");
        }

        // RECUPERATION DES NUTRIMENTS
        $.ajax({
            url: `${prefix_api}aliments.php?populate=*`, 
            method: 'GET',
            dataType: 'json'
        })
        .done(function(response){
            listeAlimentsSemaine = response.filter(function(aliment) {
                return allAlimentIDs.includes(parseInt(aliment.ID_ALIMENT));  
            });

            // Parcours de listeAliments pour accumuler les valeurs des nutriments
            listeAlimentsSemaine.forEach(aliment => {
                aliment.NUTRIMENTS.forEach(nutriment => {
                    const index = totalNutriments.findIndex(n => n.category === nutriment.LIBELLE_NUTRIMENT);
                    if (index !== -1) {
                        const quantite = quantiteAliment[allAlimentIDs.indexOf(aliment.ID_ALIMENT)] || 1;
                        totalNutriments[index].value += parseFloat(nutriment.POURCENTAGE) * quantite / 100;
                    }
                });
            });

            // Initialisation des graphiques une fois les données prêtes
            initCharts(totalNutriments);
        })
        .fail(function(error){
            alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
        });
    })
    .fail(function(error){
        alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
    });

    //===========================
    // AFFICHAGE DES GRAPHIQUES
    //===========================

    function initCharts(data) {
        am5.ready(function() {
            var root = am5.Root.new("chartdiv");

            root.setThemes([
                am5themes_Animated.new(root)
            ]);
            
            var chart = root.container.children.push(
                am5percent.PieChart.new(root, {
                    endAngle: 270
                })
            );
            
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

            // series.get("colors").set("colors", [
            //     am5.color(0x8A4827), // Rouge
            //     am5.color(0x8A5927), // Rose
            //     am5.color(0x278A60), // Vert
            //     am5.color(0x7F8A27), // Jaune
            //     am5.color(0x358A27), // Bleu
            //     am5.color(0x278A81)  // Cyan
            // ]);
            
            // Utilisation des données de totalNutriments pour le graphique
            series.data.setAll(data);
            
            series.appear(1000, 100);
        });
    }

    am5.ready(function() {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("chartdiv2");
        
        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
          am5themes_Animated.new(root)
        ]);
        
        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          pinchZoomX: true,
          paddingLeft:0,
          paddingRight:1
        }));
        
        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);
        
        
        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xRenderer = am5xy.AxisRendererX.new(root, { 
          minGridDistance: 30, 
          minorGridEnabled: true
        });
        
        xRenderer.labels.template.setAll({
          rotation: -90,
          centerY: am5.p50,
          centerX: am5.p100,
          paddingRight: 15
        });
        
        xRenderer.grid.template.setAll({
          location: 1
        })
        
        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
          maxDeviation: 0.3,
          categoryField: "country",
          renderer: xRenderer,
          tooltip: am5.Tooltip.new(root, {})
        }));
        
        var yRenderer = am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1
        })
        
        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
          maxDeviation: 0.3,
          renderer: yRenderer
        }));
        
        // Create series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
          name: "Series 1",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          sequencedInterpolation: true,
          categoryXField: "country",
          tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}"
          })
        }));
        
        series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
        series.columns.template.adapters.add("fill", function (fill, target) {
          return chart.get("colors").getIndex(series.columns.indexOf(target));
        });
        
        series.columns.template.adapters.add("stroke", function (stroke, target) {
          return chart.get("colors").getIndex(series.columns.indexOf(target));
        });
        
        
        
        // Set data
        var data = [{
          country: "Lundi",
          value: 2025
        }, {
          country: "Mardi",
          value: 1882
        }, {
          country: "Mercredi",
          value: 1809
        }, {
          country: "Jeudi",
          value: 1522
        }, {
          country: "Vendredi",
          value: 1122
        }, {
          country: "Samedi",
          value: 1414
        }, {
          country: "Dimanche",
          value: 2984
        }];
        
        xAxis.data.setAll(data);
        series.data.setAll(data);
        
        
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);
        
        }); // end am5.ready()
});

