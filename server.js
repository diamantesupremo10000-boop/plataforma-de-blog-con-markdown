const express = require('express');
const db = require('./database');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// API: Obtener todos
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await db.getAll();
        res.json(posts);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// API: Obtener uno
app.get('/api/posts/:id', async (req, res) => {
    try {
        const post = await db.getById(req.params.id);
        if(post) res.json(post);
        else res.status(404).json({ error: 'Post no encontrado' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// API: Crear post
app.post('/api/posts', async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ error: 'Faltan datos' });
        
        const newPost = await db.create(title, content);
        res.status(201).json(newPost);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, () => {
    console.log(`Blog corriendo en puerto ${PORT}`);
});
