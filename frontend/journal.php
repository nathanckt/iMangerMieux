<?php
    if($login === null){
        $id  = "hide";
    }
    else{
        $id ="";
    }
?>
<section class="stats" id=<?php echo $id?>>
    <h1>
        Cette semaine
    </h1>
    <div class="charts">
        <div id="chartdiv"></div>
        <div id="chartdiv2"></div>
    </div>
    <!-- INSERER DES GRAPHIQUES ICI -->
</section>

<section class="tableau" id=<?php echo $id?>>
    <h1>Historique</h1>
    <table class="table">
    <thead>
        <tr>
            <th scope="col">Id</th>
            <th scope="col">Date</th>
            <th scope="col">Aliments</th>
            <th scope="col">CRUD</th>
        </tr>
    </thead>
    <tbody id="repasTableBody">
    </tbody>
    </table>
</section>
<section class="ajout" id=<?php echo $id?>>
    <h1 class="form-titre">Ajouter un repas</h1>
    <form id="ajout-repas" action="#" method="POST">
    <table>
        <tr>
            <th>Date du repas :</th>
            <td><input type="date" id="date" name="date"></td>
            <th>Heure du repas :</th>
            <td><input type="time" id="time" name="time"></td>
        </tr>
        <tr>
            <th>Libelle aliment :</th>
            <td>
                <select class="libelle-aliment" name="libelle-aliment" required>
                    <!-- Les options seront ajoutées dynamiquement -->
                </select>
            </td>
            <th>Quantité :</th>
            <td><input type="number" class="quantite" name="quantite" required></td>
            <td><button id="btn-ajout-aliment" type="button" class="cta">+</button></td>
        </tr>
        <tr>
            <th></th>
            <td></td>
            <th></th>
            <td><input type="submit" class="cta cta--input" value="Créer un repas"/></td>
        </tr>
    </table>
    </form>
</section>



