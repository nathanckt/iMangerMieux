
<div class="hero">
    <h1 class="hero-title">iMangerMieux</h1>
    <h2 class="hero-subtitle">Découvrez ce que vos repas cachent !</h2>
    <p class="hero-text">Notre site web innovant a été conçu pour vous aider à savoir ce que vous mangez et l’impact de vos aliments sur votre corps.</p>
    <p class="hero-text">Vous souhaitez changer d’alimentation vers un mode de vie sain, alors rejoignez l’aventure !</p>
    <div class="hero-btn">
        <a href="#" class="cta">Nos Aliments</a>
        <?php 
            if($login != null){
                echo "<a href='profil.php' class='cta'>Mon Profil</a>";
            }
            else{
                echo "<a href='connect.php' class='cta'>Se Connecter</a>";
            }
        ?>
    </div>
    <img src="imgs/fourchette.svg" alt="Dessin cartoon fourchette" class="fourchette">
    <img src="imgs/sandwich.svg" alt="Dessin cartoon sandwich" class="sandwich">
</div>
