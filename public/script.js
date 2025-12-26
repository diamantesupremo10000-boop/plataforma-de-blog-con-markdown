const apiUrl = '/api/posts';

// Elementos del DOM
const listView = document.getElementById('listView');
const readView = document.getElementById('readView');
const createSection = document.getElementById('createSection');
const articleContent = document.getElementById('articleContent');

// --- Navegación ---
function showHome() {
    createSection.classList.add('hidden');
    readView.classList.add('hidden');
    listView.classList.remove('hidden');
    loadPosts();
}

function toggleForm() {
    createSection.classList.toggle('hidden');
}

// --- API & Lógica ---

// 1. Cargar todos los posts
async function loadPosts() {
    const res = await fetch(apiUrl);
    const posts = await res.json();
    
    listView.innerHTML = posts.map(post => `
        <div class="post-card" onclick="openPost(${post.id})">
            <h2>${post.title}</h2>
            <div class="post-date">${new Date(post.created_at).toLocaleDateString()}</div>
            <p>${post.content.substring(0, 100)}...</p>
        </div>
    `).join('');
}

// 2. Abrir un post y renderizar Markdown
async function openPost(id) {
    const res = await fetch(`${apiUrl}/${id}`);
    const post = await res.json();

    // Aquí usamos la librería 'marked' importada en el HTML
    const htmlContent = marked.parse(post.content);

    articleContent.innerHTML = `
        <h1>${post.title}</h1>
        <div class="post-date">${new Date(post.created_at).toLocaleDateString()}</div>
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
        <div>${htmlContent}</div>
    `;

    listView.classList.add('hidden');
    createSection.classList.add('hidden');
    readView.classList.remove('hidden');
}

// 3. Crear Post
async function createPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;

    if (!title || !content) return alert('Completa ambos campos');

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });

    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    toggleForm();
    loadPosts();
}

// Inicio
loadPosts();
