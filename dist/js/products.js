//getting the products either from local file or remotely

class Products {
	async getProducts() {
		try {
			//axios implementation
			// let result = await axios.get("/dist/assets/products.json");
			// let data = await JSON.parse(result.request.response);

			//fetch API implemetation
			let result = await fetch("/dist/assets/products.json");
			let data = await result.json();
			let products = data.items;
			products = products.map((item) => {
				const { title, price } = item.fields;
				const { id } = item.sys;
				const image = item.fields.image.fields.file.url;
				return { title, price, id, image };
			});
			return products;
		} catch (error) {
			console.log(error);
		}
	}
}

export default Products;
