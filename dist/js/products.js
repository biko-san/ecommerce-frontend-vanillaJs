//getting the products either from local file or remotely

class Products {
	async getProducts() {
		try {
			let result = await axios.get("/dist/assets/products.json");
			//console.log();
			let data = await JSON.parse(result.request.response);
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
