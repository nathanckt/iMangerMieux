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

    function getAlimentsFull($db){
        $sql = "SELECT a.ID_ALIMENT, a.LIBELLE_ALIMENT, t.LIBELLE_TYPE, 
                   GROUP_CONCAT(n.LIBELLE_APPORT) AS LIBELLES_APPORT, 
                   GROUP_CONCAT(ap.POURCENTAGE_APPORT) AS POURCENTAGES     
            FROM ALIMENT a
            JOIN TYPE_D_ALIMENT t ON a.ID_TYPE = t.ID_TYPE
            JOIN APPORTE ap ON a.ID_ALIMENT = ap.ID_ALIMENT
            JOIN APPORT n ON ap.ID_APPORT = n.ID_APPORT
            WHERE ap.POURCENTAGE_APPORT IS NOT NULL AND ap.POURCENTAGE_APPORT != ''
            GROUP BY a.ID_ALIMENT, a.LIBELLE_ALIMENT, t.LIBELLE_TYPE
            ORDER BY a.ID_ALIMENT";
        $exe = $db->query($sql);
        $res = $exe->fetchAll(PDO::FETCH_OBJ);
        return $res;
    }

    function getAliments($db){
        $sql = "SELECT a.ID_ALIMENT, a.LIBELLE_ALIMENT, t.LIBELLE_TYPE
                FROM ALIMENT a
                INNER JOIN TYPE_D_ALIMENT t ON a.ID_TYPE = t.ID_TYPE";
        $exe = $db->query($sql);
        $res = $exe->fetchAll(PDO::FETCH_OBJ);
        return $res;
    }

    function create_aliment($db, $libelle, $type){

        $sql = "INSERT INTO ALIMENT (LIBELLE_ALIMENt, ID_TYPE)
                    VALUES (:libelleAliment, :idType)";

        $stmt = $db->prepare($sql);
        
        $stmt->execute([
            ':libelleAliment' => $libelle,
            ':idType' => $type,
        ]); 

        $user_id = $db->lastInsertId();
        return ['id' => $user_id, 'libelle' => $libelle, 'id_type' => $type];

    }

    // ======================
    // RESPONSES
    // ======================

    switch($_SERVER['REQUEST_METHOD']){
        case 'GET':
            if(isset($_GET['populate']) && $_GET['populate']){
                $result = getAlimentsFull($pdo);
                foreach ($result as &$aliment) {
                    $aliment->NUTRIMENTS = [];
                    $libelle_nutriment = explode(',', $aliment->LIBELLES_APPORT);
                    $pourcentages = explode(',', $aliment->POURCENTAGES);
                    
                    foreach ($libelle_nutriment as $index => $libelle_nutriment) {
                        $aliment->NUTRIMENTS[] = [
                            'LIBELLE_NUTRIMENT' => $libelle_nutriment,
                            'POURCENTAGE' => $pourcentages[$index]
                        ];
                    }
                    
                    unset($aliment->LIBELLES_APPORT, $aliment->POURCENTAGES);
                }
            }
            else{
                $result = getAliments($pdo);

            }
            setHeaders();
            exit(json_encode($result));
        case 'POST':
            $data = json_decode(file_get_contents("php://input"));

            if(isset($data->libelleAliment) && isset($data->idType)){
                $libelleAliment = $data->libelleAliment;
                $idType = $data->idType;

                $new_aliment = create_aliment($pdo, $libelleAliment, $idType);

                if($new_aliment){
                    setHeaders();
                    http_response_code(201); 
                    exit(json_encode($new_aliment));
                } else {
                    http_response_code(500); 
                    exit(json_encode(['error' => 'Failed to create user']));
                }
            }
        case 'DELETE':

        case 'PUT':

    }