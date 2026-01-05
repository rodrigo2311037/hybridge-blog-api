<h1 align="center">  Hybridge Blog API </h1>


![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![JSON Web Tokens](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt-5A5A5A?style=for-the-badge&logo=docsdotrs&logoColor=white)



API RESTful desarrollada con Node.js y Express para la gestión de un blog.
Incluye autenticación basada en JWT y una arquitectura modular orientada a buenas prácticas backend.
Permite la gestión de:

-Usuarios (registro y autenticación)

-Autores

-Posts de un blog

---

## Arquitectura del proyecto
El proyecto sigue una arquitectura modular con separación de responsabilidades:

```
src/
 ├─ server.js        → punto de entrada del servidor
 ├─ app.js           → configuración de Express y middlewares
 │
 ├─ routes/          → definición de endpoints (rutas)
 ├─ controllers/     → lógica de negocio
 ├─ middlewares/     → middlewares reutilizables
 ├─ config/          → configuración de Passport
 └─ models/          → modelos Sequelize (base de datos)
```

Se utiliza una arquitectura tipo MVC ligera, organizada en capas.

---

# Separación de responsabilidades:

-Las rutas solo reciben peticiones

-Los controladores manejan la lógica

-Passport maneja la autenticación

-Los modelos interactúan con la base de datos

---

La API utiliza Passport.js con dos estrategias:

-LocalStrategy	=> Autenticación inicial (login)

-JwtStrategy	=> Protección de rutas

---

<em> Flujo de autenticación paso a paso </em>

 # 1. Registro de usuario
```
Endpoint

POST /api/signup
```

Descripción:

Crea un nuevo usuario.

La contraseña se encripta con bcrypt antes de guardarse en la base de datos.

Respuesta:
```
{
  "id": 1,
  "email": "usuario@email.com"
}
```

---
# 2. Login (autenticación inicial)
```
Endpoint

POST /api/login
```

Funcionamiento interno:

*Passport usa LocalStrategy

*Se valida:

*email existente

*contraseña correcta


Si es válido:

*se genera un JWT

*se devuelve al cliente

Respuesta:
```
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer"
}
```

El token NO se guarda en el servidor (arquitectura stateless).

---

# 3. Acceso a rutas protegidas

Las rutas protegidas requieren el token en el header:
```
Authorization: Bearer <TOKEN>
```

Passport usa JwtStrategy para:

-validar la firma del token

-extraer el userId

-cargar el usuario en req.user

---

#  Ejemplo de ruta protegida

Endpoint
```
GET /api/profile
```

Respuesta:
```
{
  "id": 1,
  "email": "usuario@email.com",
  "msg": "Acceso concedido 👋"
}

```
---

# Endpoints principales

Auth
```
POST /api/signup

POST /api/login
```
Usuarios
```
GET /api/profile (protegido)
```
Blog
```
GET /api/posts

POST /api/posts (protegido)

PUT /api/posts/:id (protegido)

DELETE /api/posts/:id (protegido)
```
---

Control de acceso utilizado:

-Lectura publica

-Escritura Protegida

Recursos:

Ver posts	✅	Público

Ver autores	✅	Público

Crear / editar / borrar posts	🔐	Protegido

Crear / editar / borrar autores	🔐	Protegido 

Perfil de usuario		🔐 Protegido 



---
## Seguridad aplicada

* Contraseñas encriptadas con bcrypt
* Autenticación stateless con JWT
* Protección de rutas con middleware reutilizable
* No se usan sesiones de servidor

---
Buenas prácticas implementadas

✔️ Separación de capas

✔️ Uso de middlewares

✔️ JWT para autenticación moderna

✔️ Código modular y mantenible

✔️ Arquitectura escalable

---

Tecnologías utilizadas

Node.js

Express.js

Passport.js

JWT (jsonwebtoken)

Sequelize

bcrypt

PostgreSQL  (supabase)

---

## 🔧 Instalación y ejecución local

1. Clonar el repositorio:

```
git clone https://github.com/rodrigo2311037/hybridge-blog-api.git
cd hybridge-blog-api
```
2. Instalar dependencias:
```
npm install
```
3. Crear archivo .env en la raíz del proyecto:
```
JWT_SECRET=super_secret_key
DATABASE_URL=tu_url_de_base_de_datos

```
4. Ejecutar el servidor:
```
node src/server.js
```
5. El servidor quedará disponible en:
```
http://localhost:3000
```


---
🌍 El proyecto se encuentra desplegado en Render:
```
https://TU-APP.onrender.com
```
