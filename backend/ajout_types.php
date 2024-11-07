<?php
    require_once("init_pdo.php");

    $fichier = fopen("data/aliments.csv", "r");

    // On enlève la première ligne 
    fgetcsv($fichier, 0, ";");

    if ($fichier) {
        while (($ligne = fgetcsv($fichier, 0, ";"))) { 
            if (count($ligne) >= 2) {
                $code = $ligne[2];
                $designation = $ligne[5];

                if($designation === "-"){
                    $designation = $ligne[4];
                    $code = "$ligne[1]00";
                }

                try{
                    $pdo = new PDO($connectionString,_MYSQL_USER,_MYSQL_PASSWORD,$options);
                    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    $sql = "INSERT INTO TYPE_D_ALIMENT (ID_TYPE, LIBELLE_TYPE)
                    VALUES (:id, :libelle)";
    
                    $stmt = $pdo->prepare($sql);
                    
                    $stmt->execute([
                        ':id' => $code,
                        ':libelle' => $designation,
                    ]);            
                }
                catch (PDOException $erreur) {
                    //echo 'Erreur : '.$erreur->getMessage();
                }        
            
                // echo "Le code est : $code et la designation est : $designation";
                // echo "<br>";
            }
        }
    }
    $pdo = null;