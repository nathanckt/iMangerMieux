<?php
    require_once('init_pdo.php');


    try{
        $pdo = new PDO($connectionString,_MYSQL_USER,_MYSQL_PASSWORD,$options);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = file_get_contents('sql/create_db.sql'); 
    
        $pdo->exec($sql);
        $pdo = null;
    }
    catch (PDOException $erreur) {
        echo 'Erreur : '.$erreur->getMessage();
    }

    
    require_once('ajout_utilisateurs.php');
    require_once('ajout_types.php');
    require_once('ajout_aliments.php');
    require_once('ajout_nutriments.php');


    echo "Base de données initialisée avec succès.";

