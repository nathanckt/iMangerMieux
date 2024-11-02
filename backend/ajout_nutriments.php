<?php
    require_once("init_pdo.php");

    $fichier = fopen("data/aliments.csv", "r");

    if($fichier){
        // On récupère la première ligne 
        $ligne = fgetcsv($fichier, 0, ";");
    
        for ($i = 9; $i < 76; $i++) {
            $code = 100 + $i;
            try{
                $pdo = new PDO($connectionString,_MYSQL_USER,_MYSQL_PASSWORD,$options);
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "INSERT INTO APPORT (ID_APPORT, LIBELLE_APPORT)
                VALUES (:code, :libelle)";
                
                $stmt = $pdo->prepare($sql);

                $ligne[$i] = str_replace(',', '', $ligne[$i]);
                                    
                $stmt->execute([
                    ':code' => $code,
                    ':libelle' => $ligne[$i],
                ]);  
            }
            catch (PDOException $erreur) {
                echo 'Erreur : '.$erreur->getMessage();
            }  
            $pdo = null;              
        }

        // On passe la ligne du dessert moyen qui est pas utile 
        $ligne = fgetcsv($fichier, 0, ";");

        while(($ligne = fgetcsv($fichier, 0, ";"))){
            $codeAliment = $ligne[6];

            echo $codeAliment;
            echo "<br>";

            for ($i = 9; $i < 76; $i++){
                $code = 100 + $i;
                $quantite = $ligne[$i];

                if($quantite != "-"){

                    if(preg_match('/^<\s([\d.]+)/', $quantite, $newQuantite)){
                        $quantite = $newQuantite[1];
                    }
                    try{
                        $pdo = new PDO($connectionString,_MYSQL_USER,_MYSQL_PASSWORD,$options);
                        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                        $sql = "INSERT INTO APPORTE (ID_ALIMENT, ID_APPORT, POURCENTAGE_APPORT)
                        VALUES (:codeAliment, :code, :pourcentage)";
                        
                        $stmt = $pdo->prepare($sql);
                                            
                        $stmt->execute([
                            ':code' => $code,
                            ':codeAliment' => $codeAliment,
                            ':pourcentage' => floatval($quantite),
                        ]);  
                    }
                    catch (PDOException $erreur) {
                        echo 'Erreur : '.$erreur->getMessage();
                    }

                    // echo "$code : $quantite";
                    // echo "<br>";
                }

            }
        }

    }
    $pdo = null;