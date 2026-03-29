🔐 Secure File Storage — Backend

Backend API du Secure File Storage & Sharing System construit avec :

Laravel 12
Laravel Sanctum (authentification API)
MySQL (ou base de données compatible)
🛡️ ClamAV (analyse antivirus via Docker)
📦 Prérequis

Assurez-vous d’avoir installé :

PHP 8.2+
Composer
MySQL / MariaDB
Docker & Docker Compose 🐳
Laravel CLI (optionnel)
🚀 Installation et configuration
1️⃣ Cloner le dépôt
git clone <repository-url>
cd backend
2️⃣ Configuration de l’environnement

Copier le fichier d’environnement :

cp .env.example .env

Configurer la base de données dans .env :

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
🔐 Configuration ClamAV

Ajouter dans .env :

CLAMAV_HOST=127.0.0.1
CLAMAV_PORT=3310
3️⃣ Installer les dépendances
composer install
4️⃣ Générer la clé de l’application
php artisan key:generate
5️⃣ Exécuter les migrations
php artisan migrate

Ou pour une base fraîche avec données :

php artisan migrate:fresh --seed
6️⃣ Lancer ClamAV (Docker) 🐳

ClamAV doit être actif pour analyser les fichiers uploadés.

Option 1 : Docker run
docker run -d --name clamav -p 3310:3310 clamav/clamav:latest
Option 2 (recommandé) : Docker Compose

Créer un fichier docker-compose.yml :

version: '3.8'

services:
clamav:
image: clamav/clamav:latest
container_name: clamav
ports: - "3310:3310"

Lancer :

docker-compose up -d

Vérifier :

docker ps

⚠️ Attendre que ClamAV soit prêt (premier lancement peut être long).

7️⃣ Démarrer le serveur Laravel
php artisan serve

Accès :

http://127.0.0.1:8000
🔐 Authentification

Le projet utilise Laravel Sanctum pour l’authentification API :

Inscription utilisateur
Connexion / Déconnexion
Authentification par token
Routes protégées
🛡️ Intégration ClamAV

Le système analyse les fichiers uploadés via ClamAV :

Envoi du fichier au container ClamAV
Détection de malware
Refus de l’upload si menace détectée
Erreur possible (503) si ClamAV n’est pas disponible
⚠️ Remarques importantes
Docker doit être en cours d’exécution
ClamAV doit être prêt avant les uploads
Ne jamais commiter le fichier .env
Exécuter les migrations après chaque pull
📁 Structure du projet
app/
├── Http/
│ ├── Controllers/
│ └── Middleware/
├── Models/

routes/
├── api.php

config/
database/
🛠️ Commandes Artisan utiles
Commande Description
php artisan serve Démarrer le serveur
php artisan migrate Exécuter les migrations
php artisan migrate:fresh --seed Reset DB + seed
php artisan key:generate Générer la clé
php artisan route:list Lister les routes
🧪 Conseils de développement
Toujours exécuter les migrations après un pull
Utiliser Postman / Insomnia pour tester l’API
Vérifier que ClamAV fonctionne avant les tests d’upload
S’assurer que la configuration .env est correcte
📄 Licence

Projet à but éducatif.
