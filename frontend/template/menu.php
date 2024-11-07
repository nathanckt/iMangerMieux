<?php
    function renderMenuToHTML($currentPageId) {
        // un tableau qui d\'efinit la structure du site
        $mymenu = array(
            // idPage titre
            'accueil' => array('ACCUEIL'),
            'aliments' => array('ALIMENTS'),
            'journal' => array('JOURNAL')
        );

        echo "<nav class='menu'>
            <ul>";

        foreach ($mymenu as $pageId => $pageTitle) {
            $title = $pageTitle[0];
            if($pageId === $currentPageId){
                $class = 'class="currentpage" ';
            } 
            else {
                $class = ' ';
            }

            // if(isset($_SESSION['login']) && ($currentPageId === 'journal' || $currentPageId === 'aliments')){
            //     $id = 'id="lien-desact"';
            // }
            // else{
            //     $id = '';
            // }
            echo "<li><a href='index.php?page={$pageId}' $class >$title</a></li>";
        }

        // Fin de la navigation
        echo "  </ul>
            </nav>";
    }
?>