<?php 
    $currentPageId = 'profil';
    require_once('template/head.php');
    require_once('template/menu.php');

    $login = null;
    session_start();
    if(isset($_SESSION['login'])){
        $login = $_SESSION['login'];
    }
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
                echo "<a href='profil.php' class='link-profil currentpage'>{$login}</a>";
            }
            else{
                echo "<a href='connect.php' class='link-profil currentpage'>Se connecter</a>";
            }
        ?>
        </div>
    </header>
    <main>
    <div class="infos-user">
        <div class="infos">
            <div class="info">
            <h3>Nom :</h3>
            <p class="nom">Test</p>
            </div>
            <div class="info">
            <h3>Prénom :</h3>
            <p class="prenom">Test</p>
            </div>
        </div>
        <div class="infos">
            <div class="info">
            <h3>Date de naissance :</h3>
            <p class="naissance">Test</p>
            </div>
            <div class="info">
            <h3>Tranche d'âge :</h3>
            <p class="tranche">Test</p>
            </div>
        </div>
        <div class="infos">
            <div class="info">
            <h3>Sexe :</h3>
            <p class="sexe">Test</p>
            </div>
            <div class="info">
            <h3>Pratique Sportive :</h3>
            <p class="sport">Test</p>
            </div>
        </div>
        <div class="info">
            <h3>Mail :</h3>
            <p class="mail">test@test.com</p>
        </div>

        <button class="cta">Modifier</button>
        
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
    <script src="js/profil.js"></script>
</body>
</html>