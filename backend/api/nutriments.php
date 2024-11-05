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

    function get_infos($db){
        $sql = "SELECT * FROM APPORT";
        $exe = $db->query($sql);
        $res = $exe->fetchAll(PDO::FETCH_OBJ);
        return $res;
    }

    function create_apporte($db, $idAliment, $idApport, $pourcentage){

        $sql = "INSERT INTO APPORTE (ID_ALIMENT, ID_APPORT, POURCENTAGE_APPORT)
                    VALUES (:idAliment, :idApport, :pourcentage)";

        $stmt = $db->prepare($sql);
        
        $stmt->execute([
            ':idAliment' => $idAliment,
            ':idApport' => $idApport,
            ':pourcentage' => $pourcentage,
        ]); 

        return true;
    }

    // ======================
    // RESPONSES
    // ======================

    switch($_SERVER['REQUEST_METHOD']){
        case 'GET': 
            $result = get_infos($pdo);           
            setHeaders();
            exit(json_encode($result));

        case 'POST':
            $data = json_decode(file_get_contents("php://input"));

            if(isset($data->idAliment) && isset($data->idApport) && isset($data->pourcentage)){
                $idAliment = $data->idAliment;
                $idApport = $data->idApport;
                $pourcentage = $data->pourcentage;

                if(create_apporte($pdo, $idAliment, $idApport, $pourcentage)){
                    setHeaders();
                    http_response_code(201); 
                    exit(json_encode(['succes' => 'Lien effectué']));
                } else {
                    http_response_code(500); 
                    exit(json_encode(['error' => 'Failed to create user']));
                }
            }
    }