<?php
    require_once("init_pdo.php");

    $fichier = fopen("data/aliments.csv", "r");

    // On enlève la première ligne 
    fgetcsv($fichier, 0, ";");

    if ($fichier) {
        while (($ligne = fgetcsv($fichier, 0, ";"))) { 
            if (count($ligne) >= 2) {
                $code = $ligne[6];
                $designation = $ligne[7];
                $type = $ligne[5];
                $codeType = $ligne[2];

                if($type === "-"){
                    $type = $ligne[4];
                    $codeType = "$ligne[1]00";
                }
     
                try{
                    $pdo = new PDO($connectionString,_MYSQL_USER,_MYSQL_PASSWORD,$options);
                    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    $sql = "INSERT INTO ALIMENT (ID_ALIMENT, ID_TYPE, LIBELLE_ALIMENT)
                    VALUES (:id, :code, :libelle)";
    
                    $stmt = $pdo->prepare($sql);
                    
                    $stmt->execute([
                        ':id' => $code,
                        ':code' => $codeType,
                        ':libelle' => $designation,
                    ]);            
                }
                catch (PDOException $erreur) {
                    //echo 'Erreur : '.$erreur->getMessage();
                }
                
            //     echo "Le code est : $code et la designation est : $designation et le codeType est : $codeType";
            //     echo "<br>";
            }
        }
    }

    $pdo = null;