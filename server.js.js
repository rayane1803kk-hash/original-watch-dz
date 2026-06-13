const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'originalwatch_secret_2024';
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'originalwatch2024';
const DB_FILE = './watches.json';

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const seed = {
      products: [
        { id: 1,  brand: 'Festina',      name: 'Diver Cristal Sapphire', price: 33000, stock: 3, gender: 'homme', image_url: null },
        { id: 2,  brand: 'Festina',      name: 'Chronographe Sport',     price: 27500, stock: 2, gender: 'homme', image_url: null },
        { id: 3,  brand: 'Festina',      name: 'Chrono Bike Edition',    price: 32000, stock: 1, gender: 'homme', image_url: null },
        { id: 4,  brand: 'Festina',      name: 'Edition Speciale',       price: 45000, stock: 1, gender: 'homme', image_url: null },
        { id: 5,  brand: 'Michael Kors', name: 'Bradshaw Femme',         price: 28000, stock: 4, gender: 'femme', image_url: null },
        { id: 6,  brand: 'Michael Kors', name: 'Lexington Chronograph',  price: 28000, stock: 2, gender: 'femme', image_url: null },
        { id: 7,  brand: 'Michael Kors', name: 'Slim Runway',            price: 28000, stock: 3, gender: 'femme', image_url: null },
        { id: 8,  brand: 'Casio',        name: 'Classic Woman',          price: 14000, stock: 5, gender: 'femme', image_url: null },
        { id: 9,  brand: 'Guess',        name: 'Frontier Gold',          price: 29000, stock: 2, gender: 'homme', image_url: null },
        { id: 10, brand: 'Festina',      name: 'Elegance Femme',         price: 26000, stock: 2, gender: 'femme', image_url: null }
      ],
      nextId: 11
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Non autorise' });
  try {
    jwt.verify(header.replace('Bearer ', ''), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
}

app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json(db.products.slice().reverse());
});

app.get('/api/products/:id', (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Produit introuvable' });
  res.json(product);
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Identifiants incorrects' });
  }
});

app.post('/api/admin/products', auth, (req, res) => {
  const { brand, name, price, stock, gender, image_url } = req.body;
  if (!brand || !name || price == null) return res.status(400).json({ error: 'Champs requis' });
  const db = readDB();
  const product = { id: db.nextId++, brand, name, price: Number(price), stock: Number(stock) || 0, gender: gender || 'mixte', image_url: image_url || null };
  db.products.push(product);
  writeDB(db);
  res.json(product);
});

app.put('/api/admin/products/:id', auth, (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Introuvable' });
  const { brand, name, price, stock, gender, image_url } = req.body;
  db.products[idx] = { ...db.products[idx], brand, name, price: Number(price), stock: Number(stock), gender, image_url: image_url || null };
  writeDB(db);
  res.json({ success: true });
});

app.delete('/api/admin/products/:id', auth, (req, res) => {
  const db = readDB();
  db.products = db.products.filter(p => p.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ success: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('\n  Original Watch DZ running on http://localhost:' + PORT);
  console.log('  Admin panel: http://localhost:' + PORT + '/admin.html');
  console.log('  Username: ' + ADMIN_USER + ' | Password: ' + ADMIN_PASS + '\n');
});
