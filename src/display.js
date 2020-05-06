//import dependencies
import Storage from "./storage.js";
//import Products from "./products.js";

//variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//display the products

//cart
let cart = [];

//buttons
let buttonsDOM = [];

class UI {
	displayProducts(products) {
		let result = "";
		products.forEach((product) => {
			result += `<article class="product">
           <div class="img-container">
               <img
                   src="${product.image}"
                   alt="product"
                   class="product-img"
               />
               <button class="bag-btn" data-id=${product.id}>
                   <i class="fas fa-shopping-cart"></i>
                   add to cart
               </button>
           </div>
           <h3>${product.title}</h3>
           <h4>$${product.price}</h4>
       </article>
           `;
		});
		productsDOM.innerHTML = result;
	}

	getBagButtons(products) {
		const buttons = [...document.querySelectorAll(".bag-btn")];
		buttonsDOM = buttons;

		buttons.forEach((button) => {
			let id = button.dataset.id;
			let inCart = cart.find((item) => item.id === id);
			if (inCart) {
				button.innerText = "In Cart";
				button.disabled = true;
			}
			button.addEventListener("click", (event) => {
				event.target.innerText = "In Cart";
				event.target.disabled = true;

				// get product from products
				let cartItem = { ...Storage.getProduct(id), amount: 1 };

				// add product to the cart
				cart = [...cart, cartItem];

				// save cart to local Storage
				Storage.saveCart(cart);

				// set cart values
				this.setCartValues(cart);

				//display the cart item
				this.addCartItem(cartItem);

				//show cart
				this.showCart();
			});
		});
	}

	setCartValues(cart) {
		let tempTotal = 0;
		let itemsTotal = 0;
		cart.map((item) => {
			tempTotal += item.price * item.amount;
			itemsTotal += item.amount;
		});

		cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
		cartItems.innerText = itemsTotal;
	}

	addCartItem(item) {
		const div = document.createElement("div");
		div.classList.add("cart-item");
		div.innerHTML = `<img src="${item.image}" alt="product" />
        <div class="">
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove </span>
        </div>
        <div class="">
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`;

		cartContent.appendChild(div);
	}

	showCart() {
		cartOverlay.classList.add("transparentBcg");
		cartDOM.classList.add("showCart");
	}

	hideCart() {
		cartOverlay.classList.remove("transparentBcg");
		cartDOM.classList.remove("showCart");
	}

	setupApp() {
		cart = Storage.getCart();
		this.setCartValues(cart);
		this.populateCart(cart);
		cartBtn.addEventListener("click", this.showCart);
		closeCartBtn.addEventListener("click", this.hideCart);
	}

	populateCart(cart) {
		cart.forEach((item) => {
			this.addCartItem(item);
		});
	}

	cartLogic() {
		//clear cart functionality
		clearCartBtn.addEventListener("click", () => {
			this.clearCart();
		});

		//cart functionality
		cartContent.addEventListener("click", (event) => {
			let updateItem = event.target;
			let id = updateItem.dataset.id;
			let uiClass = this;
			(function updateTarget() {
				if (updateItem.classList.contains("remove-item")) {
					cartContent.removeChild(updateItem.parentElement.parentElement);
					uiClass.removeItem(id);
				} else if (updateItem.classList.contains("fa-chevron-up")) {
					let tempItem = cart.find((item) => item.id === id);
					tempItem.amount += 1;
					Storage.saveCart(cart);
					uiClass.setCartValues(cart);
					updateItem.nextElementSibling.innerText = tempItem.amount;
				} else if (updateItem.classList.contains("fa-chevron-down")) {
					let tempItem = cart.find((item) => item.id === id);
					if (tempItem.amount > 1) {
						tempItem.amount -= 1;
						Storage.saveCart(cart);
						uiClass.setCartValues(cart);
						updateItem.previousElementSibling.innerText = tempItem.amount;
					} else {
						cartContent.removeChild(updateItem.parentElement.parentElement);
						uiClass.removeItem(id);
					}
				}
			})();
		});
	}
	clearCart() {
		let cartItems = cart.map((item) => item.id);
		cartItems.forEach((id) => this.removeItem(id));

		while (cartContent.children.length > 0) {
			cartContent.removeChild(cartContent.children[0]);
		}
		this.hideCart();
	}
	removeItem(id) {
		cart = cart.filter((item) => item.id !== id);
		this.setCartValues(cart);
		Storage.saveCart(cart);
		let button = this.getSingleButton(id);
		button.disabled = false;
		button.innerHTML = `<i class="fas fa-shopping-cart"></i>
        add to cart`;
		this.populateCart(cart);
	}

	getSingleButton(id) {
		return buttonsDOM.find((button) => button.dataset.id === id);
	}
}

export default UI;
