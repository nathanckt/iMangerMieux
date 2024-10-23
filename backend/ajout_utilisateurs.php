<?php
    require_once("init_pdo.php");

    $fichier = fopen("data/aliases.csv", "r");

    // On enlève la première ligne 
    fgetcsv($fichier, 0, ",");

    if ($fichier) {
        while (($ligne = fgetcsv($fichier, 0, ","))) { 
            if (count($ligne) >= 12) {
                // Récupération de l'alias et du nom
                $alias = $ligne[0];
                $nom = $ligne[1]; 
                $sexe = $ligne[9];
                $date = $ligne[10];
                $mdp = $ligne[11];
                $sport = $ligne[12];

                // Création d'un mail à partir de l'alias
                $mail = strtolower($alias);
                $mail = str_replace(' ', '.', $mail);
                $mail = "$mail@star-wars.com";

                // Sexe
                if($sexe === "homme"){
                    $numberSexe = 1;
                }
                elseif ($sexe === "femme"){
                    $numberSexe = 2;
                }
                else{
                    $numberSexe = 3;
                }

                // Tranche d'âge
                if($date < date("Y-m-d", strtotime("-40 years"))){
                    $tranche = 1;
                }
                elseif ($date < date("Y-m-d", strtotime("-60 years"))){
                    $tranche = 2;
                }
                else{
                    $tranche = 3;
                }

                try {
                    $pdo = new PDO($connectionString,_MYSQL_USER,_MYSQL_PASSWORD,$options);
                    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                        
                    $sql = "INSERT INTO UTILISATEUR (LOGIN, ID_SEXE, ID_TRANCHE, ID_SPORT, MOT_DE_PASSE, NOM, PRENOM, MAIL, DATE_DE_NAISSANCE)
                    VALUES (:alias, :numberSexe, :tranche, :sport, :mdp, :nom, :nom, :mail, :date)";

                    $stmt = $pdo->prepare($sql);
                    
                    $stmt->execute([
                        ':alias' => $alias,
                        ':numberSexe' => $numberSexe,
                        ':tranche' => $tranche,
                        ':sport' => $sport,
                        ':mdp' => $mdp,
                        ':nom' => $nom,
                        ':mail' => $mail,
                        ':date' => $date,
                    ]);            
                }
                catch (PDOException $erreur) {
                    echo 'Erreur : '.$erreur->getMessage();
                }
            
                $pdo = null;

                // echo "Alias: $alias, Name: $nom, Mail $mail <br>";
            }
        }
    }

    fclose($fichier);