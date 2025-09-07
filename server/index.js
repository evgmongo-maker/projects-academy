const express = require('express');
const twilio = require('twilio');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Twilio setup (replace with your credentials)
const TWILIO_ACCOUNT_SID = 'YOUR_TWILIO_ACCOUNT_SID';
const TWILIO_AUTH_TOKEN = 'YOUR_TWILIO_AUTH_TOKEN';
const TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886'; // Twilio sandbox WhatsApp number
const USER_WHATSAPP_TO = 'whatsapp:+972542050802';
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Function to send WhatsApp message
function sendWhatsAppMessage(body) {
  return twilioClient.messages.create({
    from: TWILIO_WHATSAPP_FROM,
    to: USER_WHATSAPP_TO,
    body,
  });
}

// Periodic check for tasks due in one hour
setInterval(() => {
  const todos = readTodos();
  const now = new Date();
  todos.forEach(todo => {
    if (!todo.dueDate || todo.completed) return;
    const due = new Date(todo.dueDate);
    const diffMs = due - now;
    // If due in 1 hour (+/- 2 min window), and not already notified
    if (diffMs > 0 && diffMs < 62 * 60 * 1000 && !todo.whatsappNotified) {
      sendWhatsAppMessage(`Reminder: Your task "${todo.text}" is due at ${due.toLocaleString()}`)
        .then(() => {
          todo.whatsappNotified = true;
          writeTodos(todos);
          console.log('WhatsApp reminder sent for task:', todo.text);
        })
        .catch(err => {
          console.error('Failed to send WhatsApp:', err.message);
        });
    }
  });
}, 60 * 1000); // Check every minute
app.use(cors());
app.use(express.json());
const PORT = 4000;
const JWT_SECRET = 'your_jwt_secret_key'; // Change this to a strong secret in production
const USERS_FILE = path.join(__dirname, 'users.json');
const PROJECTS_FILE = path.join(__dirname, 'projects.json');
const TODOS_FILE = path.join(__dirname, 'todos.json');
// Helper functions to read and write todos
function readTodos() {
  if (!fs.existsSync(TODOS_FILE)) {
    fs.writeFileSync(TODOS_FILE, '[]');
  }
  const data = fs.readFileSync(TODOS_FILE);
  return JSON.parse(data);
}

function writeTodos(todos) {
  fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2));
}

// Get all todos for current user
app.get('/api/todos', authenticateToken, (req, res) => {
  const todos = readTodos().filter(t => t.user === req.user.username);
  res.json(todos);
});

// Add a new todo
app.post('/api/todos', authenticateToken, (req, res) => {
  const { text, dueDate } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Todo text is required.' });
  }
  const todos = readTodos();
  const newTodo = {
    id: Date.now(),
    text,
    completed: false,
    user: req.user.username,
    createdAt: new Date().toISOString(),
    dueDate: dueDate || null,
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// Update a todo
app.put('/api/todos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { text, completed, dueDate } = req.body;
  const todos = readTodos();
  const idx = todos.findIndex(t => t.id == id && t.user === req.user.username);
  if (idx === -1) {
    return res.status(404).json({ error: 'Todo not found.' });
  }
  todos[idx] = {
    ...todos[idx],
    text: text ?? todos[idx].text,
    completed: completed ?? todos[idx].completed,
    dueDate: dueDate !== undefined ? dueDate : todos[idx].dueDate,
  };
  writeTodos(todos);
  res.json(todos[idx]);
});

// Delete a todo
app.delete('/api/todos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  let todos = readTodos();
  const idx = todos.findIndex(t => t.id == id && t.user === req.user.username);
  if (idx === -1) {
    return res.status(404).json({ error: 'Todo not found.' });
  }
  const deleted = todos[idx];
  todos = todos.filter(t => t.id != id || t.user !== req.user.username);
  writeTodos(todos);
  res.json(deleted);
});
// Helper functions to read and write comments
function readComments() {
  if (!fs.existsSync(COMMENTS_FILE)) {
    fs.writeFileSync(COMMENTS_FILE, '[]');
  }
  const data = fs.readFileSync(COMMENTS_FILE);
  return JSON.parse(data);
}

function writeComments(comments) {
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
}
// Get comments for a project
app.get('/api/projects/:id/comments', (req, res) => {
  const { id } = req.params;
  const comments = readComments().filter(c => c.projectId == id);
  res.json(comments);
});

// Add a comment to a project
app.post('/api/projects/:id/comments', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Comment text is required.' });
  }
  const comments = readComments();
  const newComment = {
    id: Date.now(),
    projectId: id,
    text,
    author: req.user.username,
    createdAt: new Date().toISOString(),
  };
  comments.push(newComment);
  writeComments(comments);
  res.status(201).json(newComment);
});

// Update a comment
app.put('/api/comments/:commentId', authenticateToken, (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;
  const comments = readComments();
  const idx = comments.findIndex(c => c.id == commentId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Comment not found.' });
  }
  if (comments[idx].author !== req.user.username) {
    return res.status(403).json({ error: 'You can only edit your own comments.' });
  }
  comments[idx].text = text ?? comments[idx].text;
  writeComments(comments);
  res.json(comments[idx]);
});

// Delete a comment
app.delete('/api/comments/:commentId', authenticateToken, (req, res) => {
  const { commentId } = req.params;
  let comments = readComments();
  const idx = comments.findIndex(c => c.id == commentId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Comment not found.' });
  }
  if (comments[idx].author !== req.user.username) {
    return res.status(403).json({ error: 'You can only delete your own comments.' });
  }
  const deleted = comments[idx];
  comments = comments.filter(c => c.id != commentId);
  writeComments(comments);
  res.json(deleted);
});
// Helper functions to read and write projects
function readProjects() {
  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, '[]');
  }
  const data = fs.readFileSync(PROJECTS_FILE);
  return JSON.parse(data);
}

function writeProjects(projects) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}
// Get all projects
app.get('/api/projects', (req, res) => {
  const projects = readProjects();
  res.json(projects);
});

// Create a new project
app.post('/api/projects', authenticateToken, (req, res) => {
  const { title, description, image } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }
  const projects = readProjects();
  const newProject = {
    id: Date.now(),
    title,
    description,
    image: image || '',
    likes: 0,
    dislikes: 0,
  };
  projects.push(newProject);
  writeProjects(projects);
  res.status(201).json(newProject);
});

// Update a project
app.put('/api/projects/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, image, likes, dislikes } = req.body;
  const projects = readProjects();
  const idx = projects.findIndex(p => p.id == id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Project not found.' });
  }
  projects[idx] = {
    ...projects[idx],
    title: title ?? projects[idx].title,
    description: description ?? projects[idx].description,
    image: image ?? projects[idx].image,
    likes: likes ?? projects[idx].likes,
    dislikes: dislikes ?? projects[idx].dislikes,
  };
  writeProjects(projects);
  res.json(projects[idx]);
});

// Delete a project
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  let projects = readProjects();
  const idx = projects.findIndex(p => p.id == id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Project not found.' });
  }
  const deleted = projects[idx];
  projects = projects.filter(p => p.id != id);
  writeProjects(projects);
  res.json(deleted);
});

app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

// Protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
  // req.user is set by authenticateToken middleware
  res.json({
    message: 'This is a protected profile route.',
    user: req.user
  });
});

// Helper functions to read and write users
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]');
  }
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  const users = readUsers();
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'Username already exists.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json({ message: 'User registered successfully.' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
    // Include email in JWT payload and response if present
    const token = jwt.sign({ username: user.username, email: user.email || '' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { username: user.username, email: user.email || '' } });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
