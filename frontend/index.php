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
        <div class="hero">
            <h1 class="hero-title">iMangerMieux</h1>
            <h2 class="hero-subtitle">Découvrez ce que vos repas cachent !</h2>
            <p class="hero-text">Notre site web innovant a été conçu pour vous aider à savoir ce que vous mangez et l’impact de vos aliments sur votre corps.</p>
            <p class="hero-text">Vous souhaitez changer d’alimentation vers un mode de vie sain, alors rejoignez l’aventure !</p>
        </div>
    </main>
</body>
</html>