# 🔐 Secure File Storage — Backend

Backend API for the **Secure File Storage & Sharing System** built with:

- Laravel 12
- Laravel Sanctum (API Authentication)
- MySQL (or compatible database)

---

## 📦 Requirements

Make sure you have the following installed:

- PHP 8.2+
- Composer
- MySQL / MariaDB
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

php artisan migrate:fresh

```bash
php artisan migrate
```

---

### 6️⃣ Seed Database (Optional — Fresh Install)

This will reset the database and populate it with sample data:

```bash
php artisan migrate:fresh --seed
```

⚠️ This command deletes all existing tables and data.

---

### 7️⃣ Start Development Server

```bash
php artisan serve
```

Server will run at:

```
http://127.0.0.1:8000
```

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
 │   └── Middleware/
 ├── Models/

routes/
 ├── api.php

config/
database/
```

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
- Never commit your `.env` file
- Use API tools like Postman for testing endpoints

---

## 📄 License

This project is for educational purposes.
