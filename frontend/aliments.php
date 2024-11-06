<h1>
    Nos Aliments
</h1>
<table class="table">
<thead>
    <tr>
        <th scope="col">Id</th>
        <th scope="col">Libelle</th>
        <th scope="col">Type</th>
        <th scope="col">CRUD</th>
    </tr>
</thead>
<tbody id="studentsTableBody">
</tbody>
</table>

<h1>Ajouter un aliment</h1>
<form id="ajout-aliment" action="#" method="POST">
<table>
    <tr>
        <th>Libelle aliment :</th>
        <td><input type="text" id="libelle" name="libelle" required></td>
        <th>Type d'aliment:</th>
        <td>
            <select id="type" name="type" required>
                <!-- Les options seront ajoutées dynamiquement -->
            </select>
        </td>
    </tr>
    <tr>
        <th>Libelle nutriment :</th>
        <td>
            <select class="libelle-nutri" name="libelle-nutri" required>
                <!-- Les options seront ajoutées dynamiquement -->
            </select>
        </td>
        <th>Pourcentage :</th>
        <td><input type="text" class="pourcentage-nutri" name="pourcentage-nutri" required></td>
        <td><button id="btn-ajout-nutriment" type="button" class="cta">+</button></td>
    </tr>
    <tr>
        <th></th>
        <td><input type="submit" class="cta cta--input"value="Créer un aliment"/></td>
    </tr>
</table>
</form>


