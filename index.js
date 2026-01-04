// Importar dependencias de autenticación
// Passport.js y JWT
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const jwt           = require('jsonwebtoken');
const bcrypt        = require('bcryptjs');

// Atajo elegante: middleware reutilizable para proteger rutas
const requireAuth = passport.authenticate('jwt', { session: false });

// index.js
const express = require('express');
const db = require('./models');
// Configura variables de entorno
require('dotenv').config({ silent: true });
const { Post, Author } = db;

const app = express(); // Inicializar la aplicacion Express
app.use(express.json()); // Middleware para parsear JSON

const PORT= process.env.PORT || 3000;



// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


/* ───── 2. Estrategia Local (login) ───── 
passport.use('local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', session: false },
    async (email, password, done) => {
      try {
        const user = await db.User.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: 'Usuario no existe' });
        }
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
        return done(null, user); // autenticado
      } catch (err) { return done(err); }
    }
  )
);
*/

/** Registro */
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await db.User.create({ name, email, password: hash });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


/** Login → genera token */
app.post('/api/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const payload = { id: req.user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, token_type: 'Bearer' });
  }
);


/* ───── 3. Estrategia JWT (protección) ───── */
passport.use('jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      session: false
    },
    async (payload, done) => {
      try {
        const user = await db.User.findByPk(payload.id);
        if (!user)   return done(null, false);
        return done(null, user);
      } catch (err) { return done(err, false); }
    }
  )
);


/** Ruta protegida */
app.get('/api/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // `req.user` viene de la estrategia JWT
    res.json({ id: req.user.id, email: req.user.email, msg: 'Acceso concedido 👋' });
  }
);




// HOME
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API de Hybridge Blog Posts' });
});




// CREATE POST   
// - requiere autenticación
app.post('/api/posts', requireAuth, async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    // Validar campos
    if (!title || !content || !authorId) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const post = await Post.create({ title, content, authorId});
    res.status(201).json(post);
  } catch (error) {
    console.log('Error al crear el post:', error)
    res.status(500).json({ error: 'Error interno del servidor' });
  }
})

// Read: GET - POSTS
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    console.error('Error al obtener los posts:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }    
});

// READ ONE - Get /api/posts/:id
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: { model: Author, attributes: ['id', 'name'] }
    });

    if (!post) return res.status(404).json({ error: "Post no encontrado" });

    res.json(post);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


//UPDATE - PUT /api/posts/:id   
// - requiere autenticación
app.put('/api/posts/:id', requireAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findByPk(req.params.id);

    if (!post) return res.status(404).json({ error: "Post no encontrado" });

    post.title = title ?? post.title;
    post.content = content ?? post.content;

    await post.save();
    res.json(post);
  } catch (error) {
    console.error("Error al actualizar post:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE (soft delete) - DELETE /posts/:id  
// - requiere autenticación 
app.delete('/api/posts/:id', requireAuth,async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) return res.status(404).json({ error: "Post no encontrado" });

    await post.destroy(); // soft delete
    res.json({ message: "Post eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar post:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});



// CREATE AUTHOR
// - requiere autenticación
app.post('/api/authors', requireAuth, async (req, res) =>{
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.length < 3) {
      return res.status(400).json({ error: 'El nombre es requerido'})   
    }

    const author = await Author.create({ name });
    res.status(201).json(author);
  } catch (error) {
    console.log('Error al crear el autor:', error)
    res.status(500).json({ error: 'Error interno del servidor' });
  }

});
 
// READ: GET AUTHORS
app.get('/api/get-authors', async (req, res) => {
  try {
    const authors = await Author.findAll();
    res.json(authors);
  } catch (error) {
    console.log('Error al obtener los autores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
  })


// READ ONE - Get /authors/:id
app.get('/api/authors/:id', async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);

    if (!author) return res.status(404).json({ error: "Autor no encontrado" });

    res.json(author);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// UPDATE - PUT /authors/:id
// - requiere autenticación
app.put('/api/authors/:id', requireAuth, async (req, res) => {
  try {
    const { name } = req.body;

    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).json({ error: "Autor no encontrado" });

    author.name = name ?? author.name;
    await author.save();

    res.json(author);
  } catch (error) {
    console.error("Error al actualizar autor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE (soft delete) - DELETE /authors/:id
// - requiere autenticación
app.delete('/api/authors/:id', requireAuth, async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).json({ error: "Autor no encontrado" });

    await author.destroy(); // gracias a paranoid: true → hace soft delete
    res.json({ message: "Autor eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar autor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
