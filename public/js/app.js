// ── STATE ──
let products = [];
let cart = [];
let activeFilter = 'all';

// ── FETCH PRODUCTS ──
async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    products = await res.json();
    renderProducts(products);
    document.getElementById('loading').style.display = 'none';
  } catch (e) {
    document.getElementById('loading').textContent = 'Erreur de chargement.';
  }
}

// ── RENDER PRODUCTS ──
function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  const filtered = activeFilter === 'all'
    ? list
    : list.filter(p =>
        p.brand.toLowerCase().includes(activeFilter) ||
        p.gender.toLowerCase() === activeFilter
      );

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);padding:40px;grid-column:1/-1">Aucun produit trouvé.</p>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card ${p.stock === 0 ? 'out-of-stock' : ''}" onclick="openModal(${p.id})">
      ${p.stock === 0 ? '<div class="out-badge">Épuisé</div>' : ''}
      <div class="product-img">
        ${p.image_url
          ? `<img src="${p.image_url}" alt="${p.name}" loading="lazy"/>`
          : '⌚'}
      </div>
      <div class="card-overlay"><span>Voir détails</span></div>
      <div class="card-info">
        <div class="card-brand">${p.brand}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-footer">
          <div class="card-price">${p.stock === 0 ? 'Épuisé' : Number(p.price).toLocaleString('fr-DZ') + ' DA'}</div>
          <div class="card-gender">${p.gender === 'homme' ? 'Homme' : p.gender === 'femme' ? 'Femme' : p.gender}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── FILTERS ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProducts(products);
  });
});

// ── MODAL ──
function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const inStock = p.stock > 0;

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-img">
      ${p.image_url ? `<img src="${p.image_url}" alt="${p.name}"/>` : '⌚'}
    </div>
    <div class="modal-info">
      <div class="modal-brand">${p.brand}</div>
      <div class="modal-name">${p.name}</div>
      <div class="modal-gender">${p.gender === 'homme' ? 'Pour Homme' : p.gender === 'femme' ? 'Pour Femme' : ''}</div>
      <div class="modal-price">${Number(p.price).toLocaleString('fr-DZ')} DA</div>
      <div class="modal-stock ${inStock ? 'in' : ''}">
        ${inStock ? `✓ En stock (${p.stock} disponible${p.stock > 1 ? 's' : ''})` : '✗ Épuisé'}
      </div>
      <button class="btn-add" ${!inStock ? 'disabled' : ''} onclick="addToCart(${p.id})">
        ${inStock ? 'Ajouter au panier' : 'Épuisé'}
      </button>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('productModal').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('productModal').classList.remove('open');
}

// ── CART ──
function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p || p.stock === 0) return;
  const existing = cart.find(x => x.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...p, qty: 1 });
  }
  updateCartUI();
  closeModal();
  toggleCart();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((s, x) => s + x.qty, 0);
  const countEl = document.getElementById('cartCount');
  countEl.textContent = count;
  countEl.classList.toggle('visible', count > 0);

  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty">Votre panier est vide.</div>';
    footerEl.innerHTML = '';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}"/>` : '⌚'}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${Number(item.price).toLocaleString('fr-DZ')} DA × ${item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  footerEl.innerHTML = `
    <div class="cart-total">
      <span>Total</span>
      <strong>${total.toLocaleString('fr-DZ')} DA</strong>
    </div>
    <a href="https://www.instagram.com/original_watch_dz/" target="_blank" class="btn-primary" style="display:block;text-align:center;width:100%">
      Commander sur Instagram
    </a>
  `;
}

function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
  document.getElementById('cartSidebar').classList.toggle('open');
}

// ── INIT ──
loadProducts();
