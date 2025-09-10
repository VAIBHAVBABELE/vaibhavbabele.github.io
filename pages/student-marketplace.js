
// For student-marketplace.html

function showForm(userType) {


  document.getElementById('buyer-form').style.display = userType === 'buyer' ? 'block' : 'none';
  document.getElementById('seller-form').style.display = userType === 'seller' ? 'block' : 'none';
  document.getElementById('buyerTab').classList.toggle('active', userType === 'buyer');
  document.getElementById('sellerTab').classList.toggle('active', userType === 'seller');
}
function registerBuyer() {
  let name = document.getElementById('buyerName').value.trim();
  let email = document.getElementById('buyerEmail').value.trim();
  let dept = document.getElementById('buyerDept').value.trim();
  let phone = document.getElementById('buyerPhone').value.trim();
  let address = document.getElementById('buyerAddress').value.trim();
  let messageDiv = document.getElementById('buyerMessage');

  if (!name || !email || !dept || !phone) {
    messageDiv.textContent = "❗ Please fill all required details!";
    messageDiv.style.color = "red";
    messageDiv.style.textAlign = "center";
    return;
  }

  let buyers = JSON.parse(localStorage.getItem('buyers')) || [];
  let buyer = {
    name,
    email,
    dept,
    phone,
    address,
    verified: false
  };
  buyers.push(buyer);
  localStorage.setItem('buyers', JSON.stringify(buyers));
  localStorage.setItem('lastRegistered', 'buyer');

  window.location.href = "registration-complete.html";
}

function registerSeller() {
  let name = document.getElementById('sellerName').value.trim();
  let productName = document.getElementById('productName').value.trim();
  let productDesc = document.getElementById('productDesc').value.trim();
  let productQty = document.getElementById('productQty').value.trim();
  let price = document.getElementById('price').value.trim();
  let email = document.getElementById('sellerEmail').value.trim();
  let phone = document.getElementById('sellerPhone').value.trim();
  let address = document.getElementById('sellerAddress').value.trim();
  let messageDiv = document.getElementById('sellerMessage');

  if (!name || !productName || !productDesc || !productQty || !price || !email || !phone) {
    messageDiv.textContent = "❗ Please fill all required details!";
    messageDiv.style.color = "red";
    messageDiv.style.textAlign = "center";
    return;
  }

  let sellers = JSON.parse(localStorage.getItem('sellers')) || [];
  let seller = {
    name,
    productName,
    productDesc,
    productQty,
    price,
    email,
    phone,
    address,
    verified: false
  };
  sellers.push(seller);
  localStorage.setItem('sellers', JSON.stringify(sellers));
  localStorage.setItem('lastRegistered', 'seller');

  window.location.href = "registration-complete.html";
}


// For product-list.html

const products = [
  { name: "Engineering Books Set", price: 1500, quantity: 5, description: "Complete set for all subjects.", img: "image/Books.png" },
  { name: "Scientific Calculator", price: 500, quantity: 10, description: "For engineering and science courses.", img: "image/calculator.png" },
  { name: "Second-hand Laptop", price: 25000, quantity: 2, description: "Good condition, student use only.", img: "image/Laptop.png" },
  { name: "Hostel Bed & Mattress", price: 3500, quantity: 3, description: "Comfortable bedding set for students.", img: "image/Bed.png" },
  { name: "Stationery Combo Pack", price: 200, quantity: 15, description: "Notebooks, pens, and other essentials.", img: "image/Stationery.png" }

];

const grid = document.getElementById('product-grid');
const searchInput = document.getElementById('searchInput');

function displayProducts(list) {
  grid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = "card";
    card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p>Qty: ${p.quantity}</p>
        <p>Price: ₹${p.price}</p>
        <button class="view-details" onclick="viewDetails('${p.name}', '${p.description}', ${p.quantity}, ${p.price}, '${p.img}')">View Details</button>
      `;
    grid.appendChild(card);
  });
}


function filterProducts() {
  const term = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.card');
  let visibleCount = 0;

  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    if (title.includes(term)) {
      card.style.display = "";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });
  document.getElementById('noResults').style.display = visibleCount === 0 ? 'block' : 'none';
}

// Initial display
displayProducts(products);