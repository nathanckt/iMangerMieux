<h1>Ajouter un repas</h1>
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
        <td><input type="submit" value="Créer un aliment"/></td>
    </tr>
</table>
</form>


