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
        $sql = "SELECT * FROM TYPE_D_ALIMENT";
        $exe = $db->query($sql);
        $res = $exe->fetchAll(PDO::FETCH_OBJ);
        return $res;
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
            break;
    }