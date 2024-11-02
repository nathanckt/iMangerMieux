<?php 
    require_once('template/head.php');
    require_once('template/menu.php');

    $currentPageId = 'accueil';
    if(isset($_GET['page'])) {
    $currentPageId = $_GET['page'];
    }
?>
<body>
    <header class="head">
        <img src="imgs/logo-blanc.svg" alt="Logo iMangerMieux" class="head-logo">
        <?php
            renderMenuToHTML($currentPageId);
        ?>
        <div class="head-profil">
            <img src="imgs/icone-utilisateur-blanc.svg" alt="Icone Profil" class="icone-profil">
            <a href="profil.php" class="link-profil">Se connecter</a>
        </div>
    </header>
    <main>
        <?php
            $pageToInclude = $currentPageId . ".php";
            if(is_readable($pageToInclude))
            require_once($pageToInclude);
            else
            require_once("error.php");
        ?>
    </main>
    <script src="js/aliments.js"></script>
</body>
</html>