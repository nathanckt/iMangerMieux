<?php
    require_once('../init_pdo.php');

    // ======================
    // FUNCTIONS
    // ======================

    function setHeaders() {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
        header("Access-Control-Allow-Origin: *");
        header('Content-type: application/json; charset=utf-8');
    }
    
    function get_users_full($db){
        $sql = "SELECT u.NOM, u.PRENOM, u.MAIL, u.DATE_DE_NAISSANCE, 
               p.LIBELLE_SPORT, s.LIBELLE_SEXE, t.LIBELLE_TRANCHE,
               GROUP_CONCAT(r.ID_REPAS) AS REPAS_IDS, 
               GROUP_CONCAT(r.DATE) AS DATES
        FROM UTILISATEUR u
        JOIN PRATIQUE_SPORTIVE p ON u.ID_SPORT = p.ID_SPORT
        JOIN SEXE s ON u.ID_SEXE = s.ID_SEXE 
        JOIN TRANCHE_D_AGE t ON u.ID_TRANCHE = t.ID_TRANCHE
        JOIN REPAS r ON u.LOGIN = r.LOGIN
        GROUP BY u.LOGIN, u.NOM, u.PRENOM, u.MAIL, u.DATE_DE_NAISSANCE, 
                 p.LIBELLE_SPORT, s.LIBELLE_SEXE, t.LIBELLE_TRANCHE";

        $exe = $db->query($sql);
        $res = $exe->fetchAll(PDO::FETCH_OBJ);
        return $res;
    }

    function get_users($db){
        $sql = "SELECT  u.NOM, u.PRENOM, u.MAIL, u.DATE_DE_NAISSANCE, p.LIBELLE_SPORT, s.LIBELLE_SEXE, t.LIBELLE_TRANCHE
            FROM UTILISATEUR u
            JOIN PRATIQUE_SPORTIVE p ON u.ID_SPORT = p.ID_SPORT
            JOIN SEXE s ON u.ID_SEXE = s.ID_SEXE 
            JOIN TRANCHE_D_AGE t ON u.ID_TRANCHE = t.ID_TRANCHE";

        $exe = $db->query($sql);
        $res = $exe->fetchAll(PDO::FETCH_OBJ);
        return $res;
    }

    function create_users($db, $login, $mdp, $nom, $prenom, $mail, $date, $tranche, $sexe, $sport){

        $sql = "INSERT INTO UTILISATEUR (LOGIN, ID_SEXE, ID_TRANCHE, ID_SPORT, MOT_DE_PASSE, NOM, PRENOM, MAIL, DATE_DE_NAISSANCE)
                    VALUES (:login, :numberSexe, :tranche, :sport, :mdp, :nom, :prenom, :mail, :date)";

        $stmt = $pdo->prepare($sql);
        
        $stmt->execute([
            ':login' => $login,
            ':numberSexe' => $sexe,
            ':tranche' => $tranche,
            ':sport' => $sport,
            ':mdp' => $mdp,
            ':nom' => $nom,
            ':prenom' => $prenom,
            ':mail' => $mail,
            ':date' => $date,
        ]); 

        $user_id = $db->lastInsertId();
        return ['id' => $user_id, 'name' => $name, 'email' => $mail];

    }



    // ======================
    // RESPONSES
    // ======================

    switch($_SERVER['REQUEST_METHOD']){
        case 'GET':
            if(isset($_GET['populate']) && $_GET['populate'] === '*'){
                $result = get_users_full($pdo);
                foreach ($result as &$user) {
                    $user->REPAS = [];
                    $repas_ids = explode(',', $user->REPAS_IDS);
                    $dates = explode(',', $user->DATES);
                    
                    foreach ($repas_ids as $index => $id_repas) {
                        $user->REPAS[] = [
                            'ID_REPAS' => $id_repas,
                            'DATE' => $dates[$index]
                        ];
                    }
                    
                    unset($user->REPAS_IDS, $user->DATES);
                }
            }
            else{
                $result = get_users($pdo);
            }
            setHeaders();
            exit(json_encode($result));

        case 'POST':
            $data = json_decode(file_get_contents("php://input"));
            if(isset($data->login) && isset($data->mdp)){
                $nom = $data->nom;
                $mail = $data->mail;
                $login = $data->login;
                $mdp = $data->mdp;
                $prenom = $data->prenom;
                $tranche = $data->tranche;
                $sexe = $data->sexe;
                $sport = $data->sport;
                $date = $data->date;

                $new_users = create_users($pdo, $login, $mdp, $nom, $prenom, $mail, $date, $tranche, $sexe, $sport);

                if($new_users){
                    setHeaders();
                    http_response_code(201); 
                    exit(json_encode($new_users));
                } else {
                    http_response_code(500); 
                    exit(json_encode(['error' => 'Failed to create user']));
                }

            } else {
                http_response_code(400); 
                exit(json_encode(['error' => 'Invalid input']));
            }
    }