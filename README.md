# Peres Systems - Backend Setup Guide

This document provides the complete instructions and code blueprint to build the Python/Django backend required by the Peres Systems frontend application.

## 1. Technology Stack

*   **Language:** Python 3.x
*   **Framework:** Django
*   **API Layer:** Django REST Framework (DRF)
*   **Database:** PostgreSQL (recommended)
*   **CORS:** `django-cors-headers` to allow the frontend to communicate with the API.

## 2. Django Project Setup

If you are new to Django, follow these steps to create the project structure.

```bash
# 1. Create a project directory and navigate into it
mkdir peres-systems-backend
cd peres-systems-backend

# 2. Create a Python virtual environment and activate it
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# 3. Install required packages
pip install django djangorestframework psycopg2-binary django-cors-headers

# 4. Start a new Django project
django-admin startproject peres_systems .

# 5. Create a new app to handle our API logic
python manage.py startapp api
```

Now, add `rest_framework`, `api`, and `corsheaders` to your `INSTALLED_APPS` in `peres_systems/settings.py`.

```python
# peres_systems/settings.py

INSTALLED_APPS = [
    # ...
    'django.contrib.staticfiles',
    # --- Add these ---
    'rest_framework',
    'corsheaders',
    'api',
    # -----------------
]

# Add this middleware
MIDDLEWARE = [
    # ...
    'corsheaders.middleware.CorsMiddleware', # Add this right before CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    # ...
]

# Add this setting to allow your frontend to connect
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000", # Add the URL of your running frontend app
]
```

## 3. Backend Code Blueprint

Place the following code into the corresponding files inside your `api` app directory (`peres-systems-backend/api/`).

*   **`api/models.py`**: Defines the database tables.
*   **`api/serializers.py`**: Defines how data is converted to/from JSON.
*   **`api/views.py`**: Defines the logic for each API endpoint.
*   **`api/urls.py`**: Maps URLs to the view logic.

You will also need to update your project's main `peres_systems/urls.py` to include the API URLs.

---

## 4. API Contract

The frontend application expects the following API endpoints to be available. The `ModelViewSet` in the provided `views.py` will create these automatically.

| Endpoint                  | HTTP Method | Description                   | Request Body (JSON)                               | Success Response (JSON)                           |
| ------------------------- | ----------- | ----------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `/api/clients/`           | `GET`       | Get all clients               | N/A                                               | `[Client, Client, ...]`                           |
| `/api/clients/`           | `POST`      | Create a new client           | `Omit<Client, 'id', 'createdAt'>`                 | `Client` (with new `id` and `createdAt`)          |
| `/api/clients/<id>/`      | `GET`       | Get a single client           | N/A                                               | `Client`                                          |
| `/api/clients/<id>/`      | `PUT`       | Update a client               | `Client`                                          | `Client`                                          |
| `/api/clients/<id>/`      | `DELETE`    | Delete a client               | N/A                                               | `204 No Content`                                  |
| **--- Tickets ---**       |             |                               |                                                   |                                                   |
| `/api/tickets/`           | `GET`       | Get all tickets               | N/A                                               | `[Ticket, Ticket, ...]`                           |
| `/api/tickets/`           | `POST`      | Create a new ticket           | `Omit<Ticket, 'id', 'createdAt'>`                 | `Ticket` (with new `id` and `createdAt`)          |
| `/api/tickets/<id>/`      | `GET`       | Get a single ticket           | N/A                                               | `Ticket`                                          |
| `/api/tickets/<id>/`      | `PUT`       | Update a ticket               | `Ticket`                                          | `Ticket`                                          |
| `/api/tickets/<id>/`      | `DELETE`    | Delete a ticket               | N/A                                               | `204 No Content`                                  |
| **--- Assets ---**        |             |                               |                                                   |                                                   |
| `/api/assets/`            | `GET`       | Get all assets                | N/A                                               | `[Asset, Asset, ...]`                             |
| `/api/assets/`            | `POST`      | Create a new asset            | `Omit<Asset, 'id'>`                               | `Asset` (with new `id`)                           |
| `/api/assets/<id>/`       | `GET`       | Get a single asset            | N/A                                               | `Asset`                                           |
| `/api/assets/<id>/`       | `PUT`       | Update an asset               | `Asset`                                           | `Asset`                                           |
| `/api/assets/<id>/`       | `DELETE`    | Delete an asset               | N/A                                               | `204 No Content`                                  |

**Note on IDs:** The frontend uses string-based IDs (UUIDs). The provided `models.py` uses `UUIDField` to match this requirement.

## 5. Final Steps

1.  **Run Migrations:** After saving the model files, tell Django to create the database tables.
    ```bash
    python manage.py makemigrations api
    python manage.py migrate
    ```

2.  **Create a Superuser:** This allows you to log in to the Django admin interface to manage data.
    ```bash
    python manage.py createsuperuser
    ```

3.  **Run the Development Server:**
    ```bash
    python manage.py runserver
    ```

Your backend API will now be running at `http://127.0.0.1:8000/`. The frontend application (running on its own server) can now successfully fetch data from and send data to this backend.
