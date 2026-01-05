Documentación del Flujo de Autenticación y Arquitectura

Hybridge Blog API

---
Hybridge Blog API es una API RESTful desarrollada con Node.js y Express, que permite la gestión de:

Usuarios (registro y autenticación)

Autores

Posts de un blog

El sistema implementa autenticación basada en JWT y sigue una arquitectura modular con separación de responsabilidades.

---

Arquitectura del proyecto

Se utiliza una arquitectura tipo MVC ligera, organizada en capas:

---

Separación de responsabilidades

Las rutas solo reciben peticiones

Los controladores manejan la lógica

Passport maneja la autenticación

Los modelos interactúan con la base de datos

---

La API utiliza Passport.js con dos estrategias:

Estrategia	Propósito
LocalStrategy	Autenticación inicial (login)
JwtStrategy	Protección de rutas

---

Flujo de autenticación paso a paso
 1. Registro de usuario

Endpoint

POST /api/signup


Descripción
Crea un nuevo usuario.
La contraseña se encripta con bcrypt antes de guardarse en la base de datos.

Respuesta

{
  "id": 1,
  "email": "usuario@email.com"
}

---
2. Login (autenticación inicial)

Endpoint

POST /api/login


Funcionamiento interno

Passport usa LocalStrategy

Se valida:

email existente

contraseña correcta

Si es válido:

se genera un JWT

se devuelve al cliente

Respuesta

{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer"
}


El token NO se guarda en el servidor (arquitectura stateless).

---

 3. Acceso a rutas protegidas

Las rutas protegidas requieren el token en el header:

Authorization: Bearer <TOKEN>


Passport usa JwtStrategy para:

validar la firma del token

extraer el userId

cargar el usuario en req.user

---

 4. Ejemplo de ruta protegida

Endpoint

GET /api/profile


Respuesta

{
  "id": 1,
  "email": "usuario@email.com",
  "msg": "Acceso concedido 👋"
}


---

Control de acceso
Recurso	Público	Protegido
Ver posts	✅	
Ver autores	✅	
Crear / editar / borrar posts		✅
Crear / editar / borrar autores		✅
Perfil de usuario		✅



---
Seguridad aplicada

Contraseñas encriptadas con bcrypt

Autenticación stateless con JWT

Protección de rutas con middleware reutilizable

No se usan sesiones de servidor

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

PostgreSQL / 

---

Conclusión

Este proyecto implementa una API REST segura y escalable, siguiendo patrones utilizados en backend profesional, con una arquitectura clara y fácil de mantener.