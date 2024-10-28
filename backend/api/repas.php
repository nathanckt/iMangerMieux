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

// ======================
// RESPONSES
// ======================

switch($_SERVER['REQUEST_METHOD']){
    case 'GET': 
        setHeaders();
        
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

    case 'POST':
    case 'PUT':
    case 'DELETE':
        http_response_code(405);
        exit(json_encode(['error' => 'Method not allowed']));
}
