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
        $sql = "SELECT * FROM SEXE";
        $exe = $db->query($sql);
        $res = $exe->fetchAll(PDO::FETCH_OBJ);
        return $res;
    }

    function create_sexe($db, $libelle){
        $sql = "INSERT INTO `SEXE` (`ID_SEXE`, `LIBELLE_SEXE`) VALUES (NULL, :libelle);";

        $stmt = $db->prepare($sql);
        
        $stmt->execute([
            ':libelle' => $libelle,
        ]); 

        $sexe_id = $db->lastInsertId();
        return ['ID_SEXE' => $sexe_id, 'LIBELLE_SEXE' => $libelle];
    }

    function delete_sexe_by_id($db,$id){
        $sql = "DELETE FROM SEXE WHERE ID_SEXE = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
        ]); 
        return true;
    }


    function update_sexe($db, $id, $libelle){

        $sql = "UPDATE SEXE 
                SET LIBELLE_SEXE = :libelle
                WHERE ID_SEXE = :id";


        $stmt = $db->prepare($sql);
        
        $stmt->execute([
            ':id' => $id,
            ':libelle' => $libelle,
        ]); 

        return ['ID_SEXE' => $id, 'LIBELLE_SEXE' => $libelle];

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

            if(isset($data->libelle)){
                $libelle = $data->libelle; 
                $new_sexe = create_sexe($pdo, $libelle);

                if($new_sexe){
                    setHeaders();
                    http_response_code(201); 
                    exit(json_encode($new_sexe));
                } else {
                    http_response_code(500); 
                    exit(json_encode(['error' => 'Failed to create sexe']));
                }

            } else {
                http_response_code(400); 
                exit(json_encode(['error' => 'Invalid input']));
            }

        case 'DELETE' :
            if(isset($_GET["id"])){
                $id = $_GET['id'];

                if(delete_sexe_by_id($pdo, $id)){
                    $result = get_infos($pdo);
                    setHeaders();
                    http_response_code(201);
                    exit(json_encode($result));
                }
                else{
                    http_response_code(500); 
                    exit(json_encode(['error' => 'Failed to delete user']));
                }
            } else {
            http_response_code(400); 
            exit(json_encode(['error' => 'Invalid input']));
            }


        case 'PUT' : 
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->id)){
                $libelle = $data->libelle;
                $id = $data->id;

                $new_sexe = update_sexe($pdo, $id, $libelle);

                if($new_sexe){
                    setHeaders();
                    http_response_code(201); 
                    exit(json_encode($new_sexe));
                } else {
                    http_response_code(500); 
                    exit(json_encode(['error' => 'Failed to create user']));
                }

            } else {
                http_response_code(400); 
                exit(json_encode(['error' => 'Invalid input']));
            }
    }