$(document).ready(function() {
    // Gestion de la soumission du formulaire avec jQuery
    $('#login-form').on('submit', function(event) {
        event.preventDefault(); // Empêche le rechargement de la page

        // Récupère les valeurs des champs
        const login = $('#login').val();
        const mdp = $('#mdp').val();

        console.log(mdp);


        // Vérification basique côté client
        if (!login || !mdp) {
            displayMessage('Tous les champs sont requis', 'error');
            return;
        }

        // Envoi des données au backend via AJAX
        $.ajax({
            url: 'http://localhost:8888/iMangerMieux/backend/api/connect.php',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            data: $.param({ login: login, mdp: mdp }),
            success: function(data) {
                displayMessage(data.message || 'Connexion réussie', 'success');
                // Redirige ou gère l'ID de session si besoin
                setTimeout(function() {
                    window.location.href = 'index.php'; // Remplace par l'URL cible
                }, 1000);
            },
            error: function(xhr) {
                const error = xhr.responseJSON?.error || 'Erreur lors de la connexion';
                displayMessage(error, 'error');
            }
        });
    });

    // Fonction pour afficher un message
    function displayMessage(message, type) {
        $('#message').text(message).attr('class', type);
    }
});