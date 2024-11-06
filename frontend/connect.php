<?php 
    $currentPageId = 'connect';
    $login = null;
    require_once('template/head.php');
    require_once('template/menu.php');
?>
<header class="head">
        <img src="imgs/logo-blanc.svg" alt="Logo iMangerMieux" class="head-logo">
        <?php
            renderMenuToHTML($currentPageId);
        ?>
        <div class="head-profil">
        <img src="imgs/icone-utilisateur-blanc.svg" alt="Icone Profil" class="icone-profil">
            
        <?php
            if($login != null){
                echo "<a href='profil.php' class='link-profil'>{$login}</a>";
            }
            else{
                echo "<a href='connect.php' class='link-profil'>Se connecter</a>";
            }
        ?>
        </div>
</header>

<h1>Se connecter</h1>
<form id="login-form" action="#" method="POST">
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
</form>

<div id="message"></div>

<script src="js/connect.js"></script>

<!-- A FAIRE : Rajouter un lien vers une page de création de profil (BONUS) -->
<!-- A FAIRE : Recharge la page, regarde si on a des trucs dans le POST et dans ce cas là recharge la page d'accueil en version Connecté + Gestion d'erreur -->