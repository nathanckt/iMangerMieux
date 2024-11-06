<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iMangeMieux</title>
</head>
<body>
    <?php
        session_start();
        session_unset();
        session_destroy();
        header("Location: ../index.php");
        exit;
    ?>
</body>
</html>