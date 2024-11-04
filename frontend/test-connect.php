<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php
        session_start();
        if(isset($_SESSION['login'])){
            $login = $_SESSION['login'];
            echo "<h1>Bienvenu ".$login."</h1>";
        }
    ?>
</body>
</html>