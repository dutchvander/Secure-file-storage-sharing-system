# 🔐 Secure File Storage — Backend

Backend API for the **Secure File Storage & Sharing System** built with:

- Laravel 12
- Laravel Sanctum (API Authentication)
- MySQL (or compatible database)
- ClamAV (Malware Detection)

---

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
```

---

### 2️⃣ Environment Configuration

Create your environment file:

```bash
cp .env.example .env
```

Then edit `.env` and configure your database:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

---

### 3️⃣ Install Dependencies

```bash
composer install
```

---

### 4️⃣ Generate Application Key

```bash
php artisan key:generate
```

---

### 5️⃣ Run Database Migrations

```bash
php artisan migrate
```

> ⚠️ For a fresh install with sample data:
> ```bash
> php artisan migrate:fresh --seed
> ```
> This command deletes all existing tables and data.

---

### 6️⃣ Start Development Server

```bash
php artisan serve
```

Server will run at:

```
http://127.0.0.1:8000
```

---

## 🛡️ ClamAV Malware Detection Setup

Every uploaded file is **automatically scanned** by ClamAV before being stored.
ClamAV runs inside a Docker container and communicates with Laravel over TCP.

### How it works

```
User uploads file
      ↓
File saved temporarily
      ↓
Laravel sends file path to ClamAV via TCP (port 3310)
      ↓
ClamAV scans the file
      ↓
  ┌───────────┬──────────────────────────────────────┐
  │  SAFE     │ File encrypted and stored permanently │
  │  INFECTED │ File deleted immediately + logged     │
  └───────────┴──────────────────────────────────────┘
```

---

### Starting ClamAV with Docker

Pull and run the ClamAV container:

```bash
docker run -d \
  --name clamav \
  --restart unless-stopped \
  -p 127.0.0.1:3310:3310 \
  clamav/clamav:latest
```

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

| Setting | Value         |
|---------|---------------|
| Host    | `127.0.0.1`   |
| Port    | `3310`        |
| Timeout | 15 seconds    |

These values are hardcoded in `FileController.php` inside the `scanFile()` method.
You can change them there if needed.

---

## 🔐 Authentication

This project uses **Laravel Sanctum** for API authentication.

Supported features:

- User registration
- Login / Logout
- Token-based authentication
- Protected API routes

---

## 📁 Project Structure (Important Folders)

```
app/
 ├── Http/
 │   ├── Controllers/
 │   │   └── FileController.php   ← handles upload + ClamAV scan
 │   └── Middleware/
 ├── Models/
 │   ├── File.php                 ← includes status: safe | infected | pending
 │   └── AuditLog.php             ← logs all scan results
routes/
 ├── api.php
storage/
 ├── app/
 │   ├── encrypted/               ← permanently stored encrypted files
 │   └── temp/                    ← temporary files (scanned then deleted)
```

---

## 🗄️ Database — files table

The `files` table includes a `status` column added for ClamAV integration:

| Column   | Type                              | Description                    |
|----------|-----------------------------------|--------------------------------|
| `status` | `enum('pending','safe','infected')` | Result of the ClamAV scan    |

Run the migration to add this column:

```bash
php artisan migrate
```

---

## 🧾 Audit Logs

Every scan is recorded in the `audit_logs` table:

| Field      | Value                         |
|------------|-------------------------------|
| `action`   | `scan_file`                   |
| `file_id`  | ID of the file (or null if infected) |
| `details`  | `{"result": "safe"}` or `{"result": "infected", "original_name": "..."}` |
| `ip_address` | IP of the uploader          |

---

## 🛠️ Useful Artisan Commands

| Command                            | Description                    |
|------------------------------------|--------------------------------|
| `php artisan serve`                | Start local server             |
| `php artisan migrate`              | Run migrations                 |
| `php artisan migrate:fresh --seed` | Reset DB and seed              |
| `php artisan key:generate`         | Generate app key               |
| `php artisan route:list`           | Show all routes                |

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
