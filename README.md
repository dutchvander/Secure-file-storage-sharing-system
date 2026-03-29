🔐 Secure File Storage — Backend

Backend API du Secure File Storage & Sharing System construit avec :

Laravel 12
Laravel Sanctum (authentification API)
MySQL (ou base de données compatible)
🛡️ ClamAV (analyse antivirus via Docker)
📦 Prérequis
=======

- Laravel 12
- Laravel Sanctum (API Authentication)
- MySQL (or compatible database)
- ClamAV (Malware Detection)

Assurez-vous d’avoir installé :

PHP 8.2+
Composer
MySQL / MariaDB
Docker & Docker Compose 🐳
Laravel CLI (optionnel)
🚀 Installation et configuration
1️⃣ Cloner le dépôt
=======

## 📦 Requirements

Make sure you have the following installed:

- PHP 8.2+
- Composer
- MySQL / MariaDB
- Docker (required for ClamAV)
- Laravel CLI (optional but recommended)

---

## 🚀 Installation & Setup

### 1️⃣ Clone the repository

```bash
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
=======
```

---

### 5️⃣ Run Database Migrations

````bash
php artisan migrate

Ou pour une base fraîche avec données :

php artisan migrate:fresh --seed
6️⃣ Lancer ClamAV (Docker) 🐳

ClamAV doit être actif pour analyser les fichiers uploadés.
=======
> ⚠️ For a fresh install with sample data:
> ```bash
> php artisan migrate:fresh --seed
> ```
> This command deletes all existing tables and data.

Option 1 : Docker run
docker run -d --name clamav -p 3310:3310 clamav/clamav:latest
Option 2 (recommandé) : Docker Compose

Créer un fichier docker-compose.yml :
=======
### 6️⃣ Start Development Server

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
=======
## 🛡️ ClamAV Malware Detection Setup

Every uploaded file is **automatically scanned** by ClamAV before being stored.
ClamAV runs inside a Docker container and communicates with Laravel over TCP.

### How it works

````

User uploads file
↓
File saved temporarily
↓
Laravel sends file path to ClamAV via TCP (port 3310)
↓
ClamAV scans the file
↓
┌───────────┬──────────────────────────────────────┐
│ SAFE │ File encrypted and stored permanently │
│ INFECTED │ File deleted immediately + logged │
└───────────┴──────────────────────────────────────┘

````

---

### Starting ClamAV with Docker

Pull and run the ClamAV container:

```bash
docker run -d \
  --name clamav \
  --restart unless-stopped \
  -p 127.0.0.1:3310:3310 \
  clamav/clamav:latest
````

> ⏳ First startup takes a few minutes while ClamAV downloads its virus definitions database.

---

### Verify ClamAV is running

```bash
# Check the container is up
docker ps | grep clamav

# Test the TCP connection
nc -zv 127.0.0.1 3310
```

Expected output:

```
Connection to 127.0.0.1 3310 port [tcp/*] succeeded!
```

---

### Restart ClamAV (if stopped)

```bash
docker start clamav
```

---

### ⚠️ Important — ClamAV must be running before uploading files

If ClamAV is unreachable, **all uploads will be blocked** as a security measure.
You will see this error in the UI:

```
Security scanner is unavailable. Upload blocked for safety. Please try again later.
```

Make sure the container is running before using the upload feature.

---

### ClamAV Port Configuration

| Setting | Value       |
| ------- | ----------- |
| Host    | `127.0.0.1` |
| Port    | `3310`      |
| Timeout | 15 seconds  |

These values are hardcoded in `FileController.php` inside the `scanFile()` method.
You can change them there if needed.

---

## 🔐 Authentication

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

# Projet à but éducatif.

├── Http/
│ ├── Controllers/
│ │ └── FileController.php ← handles upload + ClamAV scan
│ └── Middleware/
├── Models/
│ ├── File.php ← includes status: safe | infected | pending
│ └── AuditLog.php ← logs all scan results
routes/
├── api.php
storage/
├── app/
│ ├── encrypted/ ← permanently stored encrypted files
│ └── temp/ ← temporary files (scanned then deleted)

````

---

## 🗄️ Database — files table

The `files` table includes a `status` column added for ClamAV integration:

| Column   | Type                              | Description                    |
|----------|-----------------------------------|--------------------------------|
| `status` | `enum('pending','safe','infected')` | Result of the ClamAV scan    |

Run the migration to add this column:

```bash
php artisan migrate
````

---

## 🧾 Audit Logs

Every scan is recorded in the `audit_logs` table:

| Field        | Value                                                                    |
| ------------ | ------------------------------------------------------------------------ |
| `action`     | `scan_file`                                                              |
| `file_id`    | ID of the file (or null if infected)                                     |
| `details`    | `{"result": "safe"}` or `{"result": "infected", "original_name": "..."}` |
| `ip_address` | IP of the uploader                                                       |

---

## 🛠️ Useful Artisan Commands

| Command                            | Description        |
| ---------------------------------- | ------------------ |
| `php artisan serve`                | Start local server |
| `php artisan migrate`              | Run migrations     |
| `php artisan migrate:fresh --seed` | Reset DB and seed  |
| `php artisan key:generate`         | Generate app key   |
| `php artisan route:list`           | Show all routes    |

---

## 🧪 Development Tips

- Always run migrations after pulling new changes
- Make sure Docker and ClamAV are running before testing file uploads
- Never commit your `.env` file
- Use API tools like Postman for testing endpoints
- Temporary files are stored in `storage/app/temp/` and deleted automatically after scanning

---

## 📄 License

This project is for educational purposes.
