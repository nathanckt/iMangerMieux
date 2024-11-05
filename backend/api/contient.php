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

    function create_contient($db, $idRepas, $idAliment, $quantite){
        $sql = "INSERT INTO CONTIENT (ID_REPAS, ID_ALIMENT, QUANTITE)
                    VALUES (:idRepas, :idAliment, :quantite)";

        $stmt = $db->prepare($sql);
        
        $stmt->execute([
            ':idRepas' => $idRepas,
            ':idAliment' => $idAliment,
            ':quantite' => $quantite,
        ]); 

        return true;
    }

    // ======================
    // RESPONSES
    // ======================

    switch($_SERVER['REQUEST_METHOD']){
        case 'GET':
            break;
        case 'POST':
            $data = json_decode(file_get_contents("php://input"));

            if(isset($data->idRepas) && isset($data->idAliment) && isset($data->quantite)){
                $idRepas = $data->idRepas;
                $idAliment = $data->idAliment;
                $quantite = $data->quantite;

                if(create_contient($pdo, $idRepas, $idAliment, $quantite)){
                    setHeaders();
                    http_response_code(201); 
                    exit(json_encode(['succes' => 'Succes to create contient']));
                } else {
                    http_response_code(500); 
                    exit(json_encode(['error' => 'Failed to create contient']));
                }
            }
            else{
                http_response_code(500); 
                exit(json_encode(['error' => 'Params are empty ']));
            }
        case 'PUT': 
            // A FAIRE 
    }