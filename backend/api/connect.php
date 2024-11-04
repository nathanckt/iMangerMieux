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


    function loginUser($db, $login, $mdp){
        $mdpTheorique = recupMdpTheo($db,$login);

        if($mdpTheorique != null){
            if($mdpTheorique == $mdp){
                session_start();
                $_SESSION['login'] = $login;
                return [
                    'session_id' => session_id(),
                    'message' => 'Connexion reussie'
                ];
            }
            else{
                return ['error' => 'Le mot de passe ne correspond pas'];
            }
        }
        else{
            return ['error' => 'Aucun login correspondant'];
        }
    }

    function recupMdpTheo($db, $login){
        $sql = 'SELECT MOT_DE_PASSE FROM UTILISATEUR WHERE LOGIN = :login';

        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':login' => $login
        ]); 

        $result = $stmt->fetch(PDO::FETCH_ASSOC); 
        return $result['MOT_DE_PASSE'] ?? null;
    }

    // ======================
    // RESPONSES
    // ======================

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            // Gestion de la requête GET ici (si nécessaire)
            break;
    
        case 'POST':
            if (isset($_POST['login']) && isset($_POST['mdp'])) {
                $login = trim($_POST['login']); 
                $mdp = trim($_POST['mdp']);
                
                $res = loginUser($pdo, $login, $mdp);
                
                // Répond avec le résultat sous forme de JSON
                echo json_encode($res);
            } else {
                http_response_code(500); 
                echo json_encode(['error' => 'One of the two fields is empty']);
            }
            break;
    
        default:
            http_response_code(405); // Méthode non autorisée
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }