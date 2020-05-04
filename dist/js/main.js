// import dependecies
import Products from "./products.js";
import UI from "./display.js";
import Storage from "./storage.js";

//on launching the app
document.addEventListener("DOMContentLoaded", () => {
	const products = new Products();
	const ui = new UI();

	//setup app
	ui.setupApp();

	//get products
	products
		.getProducts()
		//show products
		.then((products) => {
			ui.displayProducts(products);
			Storage.saveProducts(products);
		})
		//enable adding to cart
		.then(() => {
			ui.getBagButtons();
			ui.cartLogic();
		});
});
