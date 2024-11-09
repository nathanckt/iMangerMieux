CREATION DE LA BASE DE DONNÉES :

Afin de créer la base de données et d'insérer les aliments, les nutriments et les utilsateurs par défaut : 

http://localhost:XXXX/iMangerMieux/backend/init_db.php

(Attention : la dernière requète SQL peut ne pas aller au bout car trop longue mais ce n'est pas dérangeant dans la phase de test)

Afin d'alimenter la base avec un premier set de test : 

http://localhost:XXXX/iMangerMieux/backend/simu.php

Ce script va créer 2 repas par jour pour l'utilisateur Chewie sur une semaine


DOCUMENTATION DE L'API : 

http://localhost:XXXX/iMangerMieux/backend/api

| Action | HTTP   | Payload | URL                                   | Description                                                                                     |
|--------|--------|---------|---------------------------------------|-------------------------------------------------------------------------------------------------|
| Read   | GET    | -       | /age.php                              | Renvoie les différentes tranches d'âge possibles pour les utilisateurs                          |
| Read   | GET    | -       | /sexe.php                             | Renvoie les différents sexes possibles pour les utilisateurs                                    |
| Create | POST   | json    | /sexe.php                             | Crée un nouveau sexe                                                                            |
| Update | PUT    | json    | /sexe.php?id=<id>                     | Modifie le sexe à l'id passé en paramètre                                                       |
| Delete | DELETE | -       | /sexe.php?id=<id>                     | Supprime le sexe à l'id passé en paramètre                                                      |
| Read   | GET    | -       | /sports.php                           | Renvoie les différentes pratiques sportives possibles pour les utilisateurs                     |
| Read   | GET    | -       | /type.php                             | Renvoie les différents types d'aliments possibles pour un aliment                               |
| Read   | GET    | -       | /users.php                            | Renvoie tous les utilisateurs accompagnés de leurs informations de base                         |
| Read   | GET    | -       | /users.php?populate=*                 | Renvoie tous les utilisateurs ayant consommé des repas ainsi que les repas consommés            |
| Read   | GET    | -       | /users.php?login=*                    | Renvoie les infos de l'utilisateur de la session s'il y a une session ouverte                   |
| Create | POST   | json    | /users.php                            | Crée un nouvel utilisateur                                                                      |
| Update | PUT    | json    | /users.php                            | Modifie l'utilisateur au login de la session ou au login passé dans le json                     |
| Delete | DELETE | -       | /users.php?login=<login>              | Supprime l'utilisateur au login passé en paramètre de l'url                                     |
| Create | POST   | json    | /connect.php                          | Crée une session si le login et le mdp passé dans le json correspondent à ceux de la base de données |
| Read   | GET    | -       | /repas.php                            | Renvoie tous les repas présents dans la base de données                                         |
| Read   | GET    | -       | /repas.php?id_repas=<id>              | Renvoie le repas passé en paramètre avec les aliments qu'il contient                            |
| Create | POST   | json    | /repas.php                            | Crée un repas pour l'utilisateur dont la session est ouverte ou dont le login est passé en paramètre |
| Update | PUT    | json    | /repas.php                            | Modifie le repas selon les informations dans le json                                            |
| Delete | DELETE | -       | /repas.php?id=<id>                    | Supprime le repas qui porte l'id passé en paramètre de l'url                                    |
| Create | POST   | json    | /contient.php                         | Ajoute un aliment à un repas                                                                    |
| Update | PUT    | json    | /contient.php                         | Modifie la quantité d'un aliment dans un repas                                                  |
| Read   | GET    | -       | /aliments.php                         | Renvoie tous les aliments avec son libellé et son type                                          |
| Read   | GET    | -       | /aliments.php?populate=*              | Renvoie tous les aliments ainsi que les nutriments qui les composent                            |
| Create | POST   | json    | /aliments.php                         | Crée un nouvel aliment                                                                          |
| Read   | GET    | -       | /nutriments.php                       | Renvoie les différents nutriments qui existent dans la base de données                          |
| Create | POST   | json    | /nutriments.php                       | Ajoute un nutriment présent dans la base de données à un aliment avec le pourcentage correspondant |

