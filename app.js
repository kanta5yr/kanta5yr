const menu = [
  { id: 'pasta', category: 'main', emoji: '🍝', name: '季節野菜のパスタ', description: '旬の野菜とハーブを使った本日のパスタ', price: 1480 },
  { id: 'burger', category: 'main', emoji: '🍔', name: 'クラシックバーガー', description: '国産牛パティと自家製ソース', price: 1680 },
  { id: 'curry', category: 'main', emoji: '🍛', name: 'スパイスカレー', description: '香り豊かな特製チキンカレー', price: 1380 },
  { id: 'salad', category: 'side', emoji: '🥗', name: 'グリーンサラダ', description: '季節の葉野菜とシトラスドレッシング', price: 780 },
  { id: 'fries', category: 'side', emoji: '🍟', name: 'フライドポテト', description: 'ローズマリーと岩塩', price: 580 },
  { id: 'coffee', category: 'drink', emoji: '☕', name: 'ハンドドリップコーヒー', description: '深煎りのオリジナルブレンド', price: 520 },
  { id: 'lemonade', category: 'drink', emoji: '🍋', name: '自家製レモネード', description: '国産レモンの爽やかな一杯', price: 620 },
  { id: 'cake', category: 'dessert', emoji: '🍰', name: 'バスクチーズケーキ', description: 'なめらかで濃厚な自家製ケーキ', price: 680 }
];
let cart = [];
let orders = JSON.parse(localStorage.getItem('table-orders') || '[]');
const yen = value => `¥${value.toLocaleString('ja-JP')}`;
const grid = document.querySelector('#menuGrid');
const items = document.querySelector('#cartItems');

function renderMenu(category = document.querySelector('.tab.active').dataset.category) {
  grid.innerHTML = menu.filter(item => category === 'all' || item.category === category).map(item => `<article class="menu-card"><div class="food-art">${item.emoji}</div><div><h3>${item.name}</h3><p>${item.description}</p><div class="card-bottom"><span class="price">${yen(item.price)}</span><button class="add-button" data-add="${item.id}" aria-label="${item.name}を追加">+</button></div></div></article>`).join('');
}
function renderCart() {
  const count = cart.reduce((sum, row) => sum + row.quantity, 0);
  const total = cart.reduce((sum, row) => sum + row.price * row.quantity, 0);
  document.querySelector('#cartCount').textContent = count;
  document.querySelector('#total').textContent = yen(total);
  document.querySelector('#orderButton').disabled = !count;
  items.innerHTML = count ? cart.map(row => `<div class="cart-item"><div><strong>${row.name}</strong><small>${yen(row.price)}</small></div><div class="quantity"><button data-change="${row.id}" data-amount="-1" aria-label="${row.name}を減らす">−</button><span>${row.quantity}</span><button data-change="${row.id}" data-amount="1" aria-label="${row.name}を増やす">+</button></div></div>`).join('') : '<p class="empty-cart">まだ商品が選ばれていません。<br>メニューから追加してください。</p>';
}
function addItem(id) { const item = menu.find(row => row.id === id); const existing = cart.find(row => row.id === id); existing ? existing.quantity++ : cart.push({ ...item, quantity: 1 }); renderCart(); }
function changeItem(id, amount) { const row = cart.find(item => item.id === id); row.quantity += amount; if (!row.quantity) cart = cart.filter(item => item.id !== id); renderCart(); }
function renderStaff() { const revenue = orders.reduce((sum, order) => sum + order.total, 0); document.querySelector('#orderCount').textContent = orders.length; document.querySelector('#salesTotal').textContent = yen(revenue); document.querySelector('#staffOrders').innerHTML = orders.length ? orders.slice().reverse().map(order => `<div class="staff-order"><strong>テーブル ${order.table} · ${yen(order.total)}</strong><br>${order.items.map(item => `${item.name} × ${item.quantity}`).join('、')}</div>`).join('') : '<p>まだ注文はありません。</p>'; }
function toast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2600); }

document.querySelector('.category-tabs').addEventListener('click', event => { if (!event.target.matches('.tab')) return; document.querySelector('.tab.active').classList.remove('active'); event.target.classList.add('active'); renderMenu(event.target.dataset.category); });
grid.addEventListener('click', event => { const button = event.target.closest('[data-add]'); if (button) addItem(button.dataset.add); });
items.addEventListener('click', event => { const button = event.target.closest('[data-change]'); if (button) changeItem(button.dataset.change, Number(button.dataset.amount)); });
document.querySelector('#orderButton').addEventListener('click', () => { const total = cart.reduce((sum, row) => sum + row.price * row.quantity, 0); orders.push({ table: 12, total, items: cart, createdAt: new Date().toISOString() }); localStorage.setItem('table-orders', JSON.stringify(orders)); cart = []; renderCart(); renderStaff(); toast('ご注文を承りました。ありがとうございます！'); });
const passwordDialog = document.querySelector('#passwordDialog'); const staffDialog = document.querySelector('#staffDialog');
document.querySelector('#staffModeButton').addEventListener('click', () => { document.querySelector('#password').value = ''; document.querySelector('#passwordError').textContent = ''; passwordDialog.showModal(); });
document.querySelector('#passwordForm').addEventListener('submit', event => { event.preventDefault(); if (document.querySelector('#password').value === 'staff2025') { passwordDialog.close(); renderStaff(); staffDialog.showModal(); } else { document.querySelector('#passwordError').textContent = 'パスワードが正しくありません。'; } });
document.querySelector('#logoutButton').addEventListener('click', () => staffDialog.close());
renderMenu(); renderCart(); renderStaff();
