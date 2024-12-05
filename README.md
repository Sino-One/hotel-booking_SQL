# SQL Backend (Express + SQLite)

## Description

API REST pour gérer un système de réservation d’hôtel avec des clients, des chambres, et des réservations. La base de données est relationnelle et construite avec SQLite.

---

## Installation

1.  Clonez ce dépôt :

    ```bash
    git clone <repository-url>
    cd sql-backend
    ```

2.  Installez les dépendances :

    ```bash
    npm install
    ```

3.  Lancez le serveur :
    ```bash
    node server.js
    ```

---

## Endpoints

### Clients

- **Lister tous les clients**  
  **GET** `/clients`  
  **Réponse :**
  ```json
  [
    {
      "id": 1,
      "name": "Alice Dupont",
      "email": "alice@example.com",
      "phone": "0612345678"
    },
    {
      "id": 2,
      "name": "Jean Martin",
      "email": "jean@example.com",
      "phone": "0623456789"
    }
  ]
  ```

### Chambres

- **Lister toutes les chambres**  
  **GET** `/rooms`  
  **Réponse :**
  ```json
  [
    {
      "id": 101,
      "room_number": 101,
      "type": "Simple",
      "price_per_night": 50,
      "is_available": true
    }
  ]
  ```

### Réservations

- **Créer une réservation**  
  **POST** `/reservations`  
  **Body :**

  ```json
  {
    "client_id": 1,
    "room_id": 101,
    "check_in_date": "2024-12-21",
    "check_out_date": "2024-12-24"
  }
  ```

  **Réponse :**

  ```json
  {
    "id": 1,
    "client_id": 1,
    "room_id": 101,
    "check_in_date": "2024-12-21",
    "check_out_date": "2024-12-24"
  }
  ```

- **Lister toutes les réservations avec les détails**  
  **GET** `/reservations`  
  **Réponse :**
  ```json
  [
    {
      "id": 1,
      "client_name": "Alice Dupont",
      "room_number": 101,
      "check_in_date": "2024-12-21",
      "check_out_date": "2024-12-24"
    }
  ]
  ```

---

## Base de Données

- Tables :
  - `Clients`: Clients enregistrés
  - `Rooms`: Chambres disponibles
  - `Reservations`: Réservations effectuées
