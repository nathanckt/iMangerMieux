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
                             <button class="cta cta--small btn-edit" >Modifier</button>
                             <button class="cta cta--small btn-delete">Supprimer</button>
                         `,
                    target: -1
                }
            ]
        });
        // $('.table').on('click', '.btn-edit', function() {
            // let row = $(this).closest('tr');
            // let userId = $(this).closest('tr').find('td.dt-type-numeric').text();
            // let cells = row.find("td");

            // cells.each(function(index){
            //     if((index != 0) && (index < cells.length - 1)){
            //         let cell = $(this).text();
            //         $(this).html(`<input type="text" value="${cell}" class="form-control">`);
            //     }
            // });

            // $(this).text("Envoyer").removeClass("btn-edit").addClass("btn-send");


            // $('.table').on('click', '.btn-send', function(){
            //     let inputs = row.find("input");

            //     let nom = inputs[0].value;
            //     let mail = inputs[1].value;

            //     let jsonData = JSON.stringify({
            //         id: userId,
            //         name: nom,
            //         email: mail
            //     });
    
            //     $.ajax({
            //         url: "http://localhost:8888/IDAW/TP4-REST/exo5/users.php",
    
            //         method: "PUT", 
    
            //         data: jsonData,
    
            //         dataType: "json"
            //     })

            //     .done(function(){
            //         let updatedUser = {
            //             id: userId, 
            //             name: nom, 
            //             email: mail 
            //         };

            //         table.row(row).data(updatedUser).draw();

            //         $(this).text("Modifier").removeClass("btn-send").addClass("btn-edit");
            //     })

            //     .fail(function(error){
            //         alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
            //     })
            // });

        // });


        // $('.table').on('click', '.btn-delete', function() {
        //     let row = $(this).closest('tr');
        //     let userId = $(this).closest('tr').find('td.dt-type-numeric').text();

        //     let jsonData = JSON.stringify({
        //         id: userId
        //     });

        //     $.ajax({
        //         url: "http://localhost:8888/IDAW/TP4-REST/exo5/users.php",

        //         method: "DELETE", 

        //         data: jsonData,

        //         dataType: "json"
        //     })

        //     .done(function(response){
        //         table.row(row).remove().draw();
        //     })

        //     .fail(function(error){
        //         alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
        //     });
            
        // });

    })

    .fail(function(error){
        alert("La requete s'est terminée en erreur :" + JSON.stringify(error));
    });

})