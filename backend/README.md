# 🌾 Smart Crop Advisor - Backend API Service

This is the backend service for the **Smart Crop Advisor** application. It is built using Java 21 and Spring Boot 3.5. It coordinates AI predictions (by communicating with the Python AI module), handles data persistence using MySQL, manages user security and profiles, and serves API endpoints to the React frontend.

---

## 🛠️ Technology Stack

* **Language**: Java 21
* **Framework**: Spring Boot 3.5
* **Security**: Spring Security (Stateless JWT Authentication)
* **JWT Library**: JJWT (Java JWT) `0.12.x`
* **Data Access**: Spring Data JPA & Hibernate ORM
* **Database**: MySQL 8.x
* **Build Tool**: Maven

---

## ⚡ Core Features

1. **JWT-Based Authentication**: Stateless security filter chain that validates tokens on every request.
2. **Crop Recommendation**: Saves soil inputs to MySQL, routes parameters to the AI module, saves and returns recommendations.
3. **Fertilizer Recommendation**: Evaluates NPK deficits, queries the AI module, computes quantities, saves and returns recommendations.
4. **Irrigation Advisory**: Employs a rule-based algorithm on moisture and climate variables to advise watering schedules.
5. **Disease Detection & reference Lookup**: Resolves plant symptoms using the AI NLP model and returns detailed treatment and prevention records from MySQL.
6. **Automatic Seeding**: Populates crop disease lookup records on first startup if the reference database is empty.
7. **Profile Management**: Profile CRUD operations secured by matching path variables with JWT security principals.

---

## 🔗 API Endpoint Reference

All endpoints, except `/auth/**` and `/health`, require a valid `Authorization: Bearer <token>` HTTP header.

### 🔑 Authentication Module
| Endpoint | Method | Auth | Description |
| :--- | :---: | :---: | :--- |
| `/api/v1/auth/register` | `POST` | Public | Register a new farmer account |
| `/api/v1/auth/login` | `POST` | Public | Authenticate credentials and receive a JWT |

### 🌾 Agricultural Advisory Module
| Endpoint | Method | Auth | Description |
| :--- | :---: | :---: | :--- |
| `/api/v1/recommend/crop` | `POST` | Token | Submit soil parameters for crop recommendation |
| `/api/v1/recommend/fertilizer` | `POST` | Token | Request fertilizer recommendations for a crop |
| `/api/v1/recommend/irrigation` | `POST` | Token | Request rule-based watering calculations |
| `/api/v1/recommend/history/{userId}` | `POST` | Token | Fetch a user's recommendation history |

### 🦠 Crop Disease Module
| Endpoint | Method | Auth | Description |
| :--- | :---: | :---: | :--- |
| `/api/v1/disease/detect` | `POST` | Token | Submit crop and symptoms to diagnose disease |
| `/api/v1/disease/list` | `GET` | Token | Fetch a list of supported diseases and crops |

### 👨‍🌾 User Profile Module
| Endpoint | Method | Auth | Description |
| :--- | :---: | :---: | :--- |
| `/api/v1/users/{id}` | `GET` | Token | Retrieve user profile details |
| `/api/v1/users/{id}` | `PUT` | Token | Update user profile details (name/location) |
| `/api/v1/users/{id}` | `DELETE` | Token | Permanently delete account and cascading records |

## 🤖 AI Module Integration Guide

If you are developing the Python AI/ML module, your server must run on **port 5000** (or whatever port is configured in `application.properties`).

You must expose the following three endpoints with these exact JSON input and output payloads:

### 1. Crop Recommendation Endpoint
* **URL**: `/predict/crop`
* **HTTP Method**: `POST`
* **JSON Request Body** (Sent by Java):
  ```json
  {
    "N": 90.0,            // Double: Nitrogen level in mg/kg
    "P": 42.0,            // Double: Phosphorus level in mg/kg
    "K": 43.0,            // Double: Potassium level in mg/kg
    "temperature": 25.5,  // Double: Ambient temperature in °C
    "humidity": 80.0,     // Double: Relative humidity percentage
    "ph": 6.5,            // Double: Soil pH level (0-14)
    "rainfall": 202.9     // Double: Annual rainfall in mm
  }
  ```
* **JSON Response Body** (Expected by Java):
  ```json
  {
    "prediction": "Rice",  // String: The recommended crop name
    "confidence": 94.7     // Double: Model confidence percentage (e.g., 0.0 to 100.0)
  }
  ```

### 2. Fertilizer Recommendation Endpoint
* **URL**: `/predict/fertilizer`
* **HTTP Method**: `POST`
* **JSON Request Body** (Sent by Java):
  ```json
  {
    "cropName": "Rice",     // String: Target crop name
    "soilType": "Loamy",    // String: Type of soil
    "nitrogen": 90.0,       // Double: Nitrogen reading
    "phosphorus": 42.0,     // Double: Phosphorus reading
    "potassium": 43.0       // Double: Potassium reading
  }
  ```
* **JSON Response Body** (Expected by Java):
  ```json
  {
    "prediction": "Urea (High Nitrogen)"   // String: The recommended fertilizer name/type
  }
  ```

### 3. Disease Detection Endpoint
* **URL**: `/predict/disease`
* **HTTP Method**: `POST`
* **JSON Request Body** (Sent by Java):
  ```json
  {
    "crop": "Tomato",                            // String: Target crop name
    "symptoms": ["yellow leaves", "brown spots"] // Array of Strings: Observed symptoms
  }
  ```
* **JSON Response Body** (Expected by Java):
  ```json
  {
    "prediction": "Early Blight" // String: Diagnosed disease name matching seed data
  }
  ```

---

## ⚙️ Configuration and Properties

Application configurations are loaded from `src/main/resources/application.properties`. For local development, settings are overridden by `application-local.properties`.

Key local variables to review:
* `spring.datasource.username`: Your MySQL username (default: `root`)
* `spring.datasource.password`: Your MySQL password (default: `Arpit@5892`)
* `ai.module.base-url`: Python Flask server endpoint (default: `http://localhost:5000`)
* `cors.allowed-origin`: React frontend URL (default: `http://localhost:3000`)
* `jwt.secret`: Signature key for signing JWT tokens (min 64 chars)
* `jwt.expiration`: Lifetime of a JWT in milliseconds (default: `86400000` = 24 hours)

---

## 🚀 How to Run Locally

### Prerequisites
1. **Java JDK 21** installed and configured on your path.
2. **MySQL Server** running locally.
3. Database `smart_crop_advisor` created (`CREATE DATABASE smart_crop_advisor;`).
4. **Python AI Server** active on port 5000.

### Step 1: Clean and Compile
Open a terminal in the `backend/` directory and run:
```bash
# Windows (PowerShell)
.\mvnw clean compile

# Linux / macOS
./mvnw clean compile
```

### Step 2: Start the Application
To launch the Spring Boot server:
```bash
# Windows (PowerShell)
.\mvnw spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```
Once the server starts up, you will see the logs indicating it is listening on port `8080` and the `DatabaseSeeder` has populated the disease lookup database.
