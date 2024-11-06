<?php
require_once('../init_pdo.php');

// ======================
// FUNCTIONS
// ======================

function setHeaders() {
    header("Access-Control-Allow-Origin: *");
    header('Content-type: application/json; charset=utf-8');
}

function get_repas_details($db, $id_repas) {
    $sql = 'SELECT r.ID_REPAS, r.DATE, r.LOGIN, 
                   a.ID_ALIMENT, a.LIBELLE_ALIMENT, c.QUANTITE
            FROM REPAS r
            JOIN CONTIENT c ON r.ID_REPAS = c.ID_REPAS
            JOIN ALIMENT a ON c.ID_ALIMENT = a.ID_ALIMENT
            WHERE r.ID_REPAS = :id_repas';

    $stmt = $db->prepare($sql);
    $stmt->execute(['id_repas' => $id_repas]);
    $result = $stmt->fetchAll(PDO::FETCH_OBJ);

    if (!empty($result)) {
        $repas_details = [
            'ID_REPAS' => $result[0]->ID_REPAS,
            'DATE' => $result[0]->DATE,
            'LOGIN' => $result[0]->LOGIN,
            'ALIMENTS' => []
        ];

        foreach ($result as $row) {
            $repas_details['ALIMENTS'][] = [
                'ID_ALIMENT' => $row->ID_ALIMENT,
                'LIBELLE_ALIMENT' => $row->LIBELLE_ALIMENT,
                'QUANTITE' => $row->QUANTITE
            ];
        }
        return $repas_details;
    }

    return null;
}

function get_repas_details_by_login($db, $login) {
    $sql = 'SELECT r.ID_REPAS, r.DATE, r.LOGIN, 
                   a.ID_ALIMENT, a.LIBELLE_ALIMENT, c.QUANTITE
            FROM REPAS r
            JOIN CONTIENT c ON r.ID_REPAS = c.ID_REPAS
            JOIN ALIMENT a ON c.ID_ALIMENT = a.ID_ALIMENT
            WHERE r.LOGIN = :login';

    $stmt = $db->prepare($sql);
    $stmt->execute(['login' => $login]);
    $result = $stmt->fetchAll(PDO::FETCH_OBJ);

    if (!empty($result)) {
        $repas_details = [
            'ID_REPAS' => $result[0]->ID_REPAS,
            'DATE' => $result[0]->DATE,
            'LOGIN' => $result[0]->LOGIN,
            'ALIMENTS' => []
        ];

        foreach ($result as $row) {
            $repas_details['ALIMENTS'][] = [
                'ID_ALIMENT' => $row->ID_ALIMENT,
                'LIBELLE_ALIMENT' => $row->LIBELLE_ALIMENT,
                'QUANTITE' => $row->QUANTITE
            ];
        }
        return $repas_details;
    }

    return null;
}

function get_all_repas($db) {
    $sql = 'SELECT r.ID_REPAS, r.DATE, r.LOGIN, 
                   a.ID_ALIMENT, a.LIBELLE_ALIMENT, c.QUANTITE
            FROM REPAS r
            JOIN CONTIENT c ON r.ID_REPAS = c.ID_REPAS
            JOIN ALIMENT a ON c.ID_ALIMENT = a.ID_ALIMENT
            ORDER BY r.ID_REPAS';

    $stmt = $db->query($sql);
    $results = $stmt->fetchAll(PDO::FETCH_OBJ);

    // Organisation des repas et aliments par ID_REPAS
    $all_repas = [];
    foreach ($results as $row) {
        if (!isset($all_repas[$row->ID_REPAS])) {
            $all_repas[$row->ID_REPAS] = [
                'ID_REPAS' => $row->ID_REPAS,
                'DATE' => $row->DATE,
                'LOGIN' => $row->LOGIN,
                'ALIMENTS' => []
            ];
        }

        $all_repas[$row->ID_REPAS]['ALIMENTS'][] = [
            'ID_ALIMENT' => $row->ID_ALIMENT,
            'LIBELLE_ALIMENT' => $row->LIBELLE_ALIMENT,
            'QUANTITE' => $row->QUANTITE
        ];
    }

    return array_values($all_repas);
}

function create_repas($db,$login,$date){
    $sql = "INSERT INTO REPAS (ID_REPAS, LOGIN, DATE)
            VALUES (:idRepas, :login, :date)";

    $stmt = $db->prepare($sql);
        
    $stmt->execute([
        ':idRepas' => NULL,
        ':login' => $login,
        ':date' => $date,
    ]); 

    $newId = $db->lastInsertId();
    return ['id' => $newId, 'login' => $login, 'date' => $date];
}

function delete_repas($db,$id){
    $sql = "DELETE FROM REPAS WHERE ID_REPAS = :idRepas";

    $stmt = $db->prepare($sql);
        
    $stmt->execute([
        ':idRepas' => $id,
    ]); 

    return true;
}

function delete_contient($db, $id){
    $sql = "DELETE FROM CONTIENT WHERE ID_REPAS = :idRepas";

    $stmt = $db->prepare($sql);
        
    $stmt->execute([
        ':idRepas' => $id,
    ]); 

    return true;
}

function update_repas($db,$id,$date){
    $sql = "UPDATE REPAS 
            SET DATE = :date
            WHERE ID_REPAS = :id";

    $stmt = $db->prepare($sql);
        
    $stmt->execute([
        ':date' => $date,
        ':id' => $id,
    ]); 

    return true;
}

// ======================
// RESPONSES
// ======================

switch($_SERVER['REQUEST_METHOD']){
    case 'GET': 
        setHeaders();
        
        //session_start();
        if(isset($_SESSION['login'])){
            $login = $_SESSION['login'];
            $populateValue = $_GET['by_login'] ?? null; 
            if ($populateValue !== null && $populateValue === "*") {        
                $result = get_repas_details_by_login($pdo, $login);
                if ($result) {
                    http_response_code(200);
                    exit(json_encode($result));
                } else {
                    http_response_code(404);
                    exit(json_encode(['error' => 'Repas not found']));
                }
            }
        }
        else{

            // FAUT MODIF ÇA 
            if (isset($_GET['id_repas'])) {
                // Récupérer les détails d'un seul repas
                $id_repas = $_GET['id_repas'];
                $result = get_repas_details($pdo, $id_repas);
                
                if ($result) {
                    exit(json_encode($result));
                } else {
                    http_response_code(404);
                    exit(json_encode(['error' => 'Repas not found']));
                }
            } else {
                // Récupérer tous les repas
                $result = get_all_repas($pdo);
                exit(json_encode($result));
            }
        }
        

       


    case 'POST':
        $data = json_decode(file_get_contents("php://input"));

        if(isset($data->dateRepas) && isset($data->heureRepas)){
            $date = $data->dateRepas;
            $heureRepas = $data->heureRepas;
            $dateRepas =  $date . ' ' . $heureRepas;

        }
        else{
            $dateRepas = date('Y-m-d H:i:s');
        }

        session_start();
        if(isset($data->login)){
            $login = $data->login;
        }
        elseif(isset($_SESSION['login'])){
            $login = $_SESSION['login'];
        }
        else{
            http_response_code(500); 
            exit(json_encode(['error' => 'Login is empty']));
            break;
        }

        $newRepasId= create_repas($pdo, $login, $dateRepas);

        if($newRepasId){
            setHeaders();
            http_response_code(201); 
            exit(json_encode($newRepasId));
        } else {
            http_response_code(500); 
            exit(json_encode(['error' => 'Failed to create user']));
        }


    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));

        if(isset($data->idRepas) && isset($data->dateRepas) && isset($data->heureRepas)){
            $dateRepas = $data->dateRepas . ' ' . $data->heureRepas;
            $idRepas = $data->idRepas;
            if(update_repas($pdo,$idRepas,$dateRepas)){
                http_response_code(201); 
                exit(json_encode(['succes' => 'Repas update sucessfully']));
            }
            else{
                http_response_code(405);
                exit(json_encode(['error' => 'Failed to delete contient']));
            }
        }
        else{
            http_response_code(500); 
            exit(json_encode(['error' => 'Failed to create user']));
        }


    case 'DELETE':
        if(isset($_GET['id'])){
            $idRepas = $_GET['id'];
            if(delete_contient($pdo,$idRepas)){
                if(delete_repas($pdo,$idRepas)){
                    http_response_code(201); 
                    exit(json_encode(['succes' => 'Repas delete sucessfully']));
                }
                else{
                    http_response_code(405);
                    exit(json_encode(['error' => 'Failed to delete repas but contient deleted']));
                }
            }
            else{
                http_response_code(405);
                exit(json_encode(['error' => 'Failed to delete contient']));
            }
        }
        http_response_code(405);
        exit(json_encode(['error' => 'Failed to delete repas']));
}
