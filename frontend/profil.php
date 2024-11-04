<?php 
    require_once('template/head.php');
    require_once('template/menu.php');

    $login = null;
    session_start();
    if(isset($_SESSION['login'])){
        $login = $_SESSION['login'];
    }
?>

    <main>
    <div class="infos-user">
        <div>
            <div class="info">
            <h3>Nom :</h3>
            <p class="nom"></p>
            </div>
            <div class="info">
            <h3>Prénom :</h3>
            <p class="prenom"></p>
            </div>
        </div>
        <div>
            <div class="info">
            <h3>Date de naissance :</h3>
            <p class="naissance"></p>
            </div>
            <div class="info">
            <h3>Tranche d'âge :</h3>
            <p class="tranche"></p>
            </div>
        </div>
        <div>
            <div class="info">
            <h3>Sexe :</h3>
            <p class="sexe"></p>
            </div>
            <div class="info">
            <h3>Pratique Sportive :</h3>
            <p class="sport"></p>
            </div>
        </div>
        <div class="info">
            <h3>Mail :</h3>
            <p class="mail"></p>
        </div>
        
    </div>
    <!-- <form id="modifForm" action="#" method="POST">
    <table>
        <tr>
            <th>Login :</th>
            <td><input type="text" id="login" name="login" required></td>
        </tr>
        <tr>
            <th>Mot de Passe :</th>
            <td><input type="password" id="mdp" name="mdp" required></td>
        </tr>
        <tr>
            <th></th>
            <td><input type="submit" value="Se Connecter"/></td>
        </tr>
    </table>
    </form> -->
    </main>
</body>
</html>