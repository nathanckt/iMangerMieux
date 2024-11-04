$(document).ready(function(){
    
    //===========================
    // RECUPERATION DES DONNEES
    //===========================
    $.ajax({
        url: `${prefix_api}users.php?login=*`,

        method: "GET",

        dataType:"json"
    })

    .done(function(response){
        //$(".nom").val() = response.NOM;
        console.log(response.NOM);

    })
})