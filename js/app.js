const products=[
{id:1,name:"AirBeat Pro Headphones",category:"Electronics",price:4499,old:5999,rating:4.8,emoji:"🎧"},
{id:2,name:"Urban Runner Sneakers",category:"Fashion",price:2999,old:3999,rating:4.7,emoji:"👟"},
{id:3,name:"Minimal Desk Lamp",category:"Home",price:1599,old:2199,rating:4.6,emoji:"💡"},
{id:4,name:"Aura Skin Serum",category:"Beauty",price:899,old:1199,rating:4.9,emoji:"🧴"},
{id:5,name:"Chrono Smart Watch",category:"Accessories",price:3499,old:4999,rating:4.7,emoji:"⌚"},
{id:6,name:"Pocket Camera",category:"Electronics",price:6799,old:8499,rating:4.5,emoji:"📷"},
{id:7,name:"Classic Overshirt",category:"Fashion",price:1899,old:2499,rating:4.6,emoji:"👕"},
{id:8,name:"Cloud Cushion",category:"Home",price:799,old:1099,rating:4.8,emoji:"🛋️"},
{id:9,name:"Glow Lip Tint",category:"Beauty",price:649,old:899,rating:4.7,emoji:"💄"},
{id:10,name:"Leather Card Holder",category:"Accessories",price:999,old:1399,rating:4.8,emoji:"👝"},
{id:11,name:"Nova Bluetooth Speaker",category:"Electronics",price:2299,old:2999,rating:4.7,emoji:"🔊"},
{id:12,name:"Everyday Backpack",category:"Fashion",price:2199,old:2999,rating:4.6,emoji:"🎒"}
];
let cart=JSON.parse(localStorage.getItem("apnaStore")||"[]"),wishlist=JSON.parse(localStorage.getItem("apnaWish")||"[]");
let category="All",query="";
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const money=n=>"₹"+n.toLocaleString("en-IN");
function save(){localStorage.setItem("apnaStore",JSON.stringify(cart));localStorage.setItem("apnaWish",JSON.stringify(wishlist));updateCounts()}
function updateCounts(){$("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);$("#wishCount").textContent=wishlist.length}
function render(){
 let list=products.filter(p=>(category==="All"||p.category===category)&&p.name.toLowerCase().includes(query.toLowerCase()));
 const sort=$("#sortSelect").value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);if(sort==="rating")list.sort((a,b)=>b.rating-a.rating);
 $("#productGrid").innerHTML=list.map(p=>`<article class="product"><div class="product-img"><button class="wish ${wishlist.includes(p.id)?"active":""}" onclick="toggleWish(${p.id})">${wishlist.includes(p.id)?"♥":"♡"}</button><span>${p.emoji}</span></div><div class="product-body"><span class="product-cat">${p.category}</span><div class="product-title">${p.name}</div><div class="rating">★★★★★ <span>${p.rating}</span></div><div class="price"><strong>${money(p.price)}</strong><del>${money(p.old)}</del></div><button class="add" onclick="addCart(${p.id})">Add to cart</button><button class="add secondary-add" onclick="viewProduct(${p.id})">Quick view</button></div></article>`).join("");
 $("#emptyState").hidden=!!list.length;
}
function addCart(id){let item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});save();toast("Added to cart");renderCart()}
function changeQty(id,d){let x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save();renderCart()}
function renderCart(){
 $("#cartItems").innerHTML=cart.length?cart.map(x=>{let p=products.find(p=>p.id===x.id);return `<div class="cart-row"><div class="mini-img">${p.emoji}</div><div><h4>${p.name}</h4><small>${money(p.price)}</small><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${x.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div><strong>${money(p.price*x.qty)}</strong></div>`}).join(""):`<div class="empty"><div>🛒</div><h3>Your cart is empty</h3><p>Add something you love.</p></div>`;
 $("#subtotal").textContent=money(cart.reduce((a,x)=>a+products.find(p=>p.id===x.id).price*x.qty,0));
}
function renderWish(){
 $("#wishItems").innerHTML=wishlist.length?wishlist.map(id=>{let p=products.find(p=>p.id===id);return `<div class="wish-row"><div class="mini-img">${p.emoji}</div><div><h4>${p.name}</h4><small>${money(p.price)}</small></div><button class="chip" onclick="addCart(${p.id})">Add</button></div>`}).join(""):`<div class="empty"><div>♡</div><h3>Your wishlist is empty</h3><p>Save products you want later.</p></div>`;
}
function toggleWish(id){wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):wishlist.push(id);save();render();renderWish();toast(wishlist.includes(id)?"Saved to wishlist":"Removed from wishlist")}
function openDrawer(id){$("#"+id).classList.add("open");$("#overlay").classList.add("show");if(id==="cartDrawer")renderCart();if(id==="wishDrawer")renderWish()}
function closeAll(){$$(".drawer,.modal").forEach(x=>x.classList.remove("open"));$("#overlay").classList.remove("show")}
function viewProduct(id){let p=products.find(x=>x.id===id);$("#modalContent").innerHTML=`<div class="modal-product"><div class="modal-image">${p.emoji}</div><div class="modal-info"><span class="eyebrow">${p.category}</span><h2>${p.name}</h2><div class="rating">★★★★★ ${p.rating}</div><div class="price"><strong>${money(p.price)}</strong><del>${money(p.old)}</del></div><p>Premium quality product selected for Apna Store. Designed for everyday use with a clean, modern experience and dependable performance.</p><button class="primary-btn full" onclick="addCart(${p.id});closeAll()">Add to cart — ${money(p.price)}</button></div></div>`;$("#productModal").classList.add("open");$("#overlay").classList.add("show")}
function toast(msg){let t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),1800)}
$$(".chip").forEach(b=>b.onclick=()=>{category=b.dataset.category;$$(".chip").forEach(x=>x.classList.toggle("active",x===b));render()});
$$(".cat-card").forEach(b=>b.onclick=()=>{category=b.dataset.category;location.hash="shop";$$(".chip").forEach(x=>x.classList.toggle("active",x.dataset.category===category));render()});
$("#searchInput").oninput=e=>{query=e.target.value;render()};$("#sortSelect").onchange=render;
$("#cartBtn").onclick=()=>openDrawer("cartDrawer");$("#wishlistBtn").onclick=()=>openDrawer("wishDrawer");$("#searchBtn").onclick=()=>{$("#searchInput").focus();location.hash="shop"};$("#overlay").onclick=closeAll;
$$("[data-close]").forEach(b=>b.onclick=closeAll);
$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("apnaDark",document.body.classList.contains("dark"));$("#themeBtn").textContent=document.body.classList.contains("dark")?"☀":"☾"};
$("#menuBtn").onclick=()=>toast("Use the section links to browse the store");
$("#clearFilter").onclick=()=>{category="All";query="";$("#searchInput").value="";$$(".chip").forEach(x=>x.classList.toggle("active",x.dataset.category==="All"));render()};
$("#newsletterForm").onsubmit=e=>{e.preventDefault();e.target.reset();toast("You’re on the list ✦")};
$("#checkoutBtn").onclick=()=>{if(!cart.length){toast("Your cart is empty");return}closeAll();toast("Checkout UI ready — frontend demo")};
if(localStorage.getItem("apnaDark")==="true"){document.body.classList.add("dark");$("#themeBtn").textContent="☀"}updateCounts();render();