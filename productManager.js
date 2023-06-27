const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct(title, description, price, thumbnails, code, stock, status) {
    if (!title || !description || !price || !code || !stock || !status) {
      throw new Error("Todos os campos são obrigatórios, exceto o thumbnails");
    }
    const products = this.getProductsFromStorage();
    const nextId = products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;
    const product = {
      id: nextId,
      title: title,
      description: description,
      price: price,
      thumbnails: thumbnails,
      code: code,
      stock: stock,
      status: true,
    };

    products.push(product);
    this.saveProductsToStorage(products);
  }

  getProducts() {
    return this.getProductsFromStorage();
  }

  getProductById(productId) {
    const products = this.getProductsFromStorage();
    const product = products.find(p => p.id === productId);
    return product || null;
  }

  updateProduct(productId, updatedFields) {
    const products = this.getProductsFromStorage();
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
      const updatedProduct = { ...products[productIndex], ...updatedFields };
      products[productIndex] = updatedProduct;
      this.saveProductsToStorage(products);
      return true;
    }

    return false;
  }

  deleteProduct(productId) {
    let products = this.getProductsFromStorage();
    products = products.filter(p => p.id !== productId);
    this.saveProductsToStorage(products);
  }

  getProductsFromStorage() {
    if (fs.existsSync(this.path)) {
      const fileData = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(fileData) || [];
    }
    return [];
  }

  saveProductsToStorage(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2), 'utf-8');
  }
}
module.exports = ProductManager;
