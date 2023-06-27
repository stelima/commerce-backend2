const fs = require('fs');

class CartsManager {
  constructor(path) {
    this.path = path;
  }

  createCart(cartId) {
    const carts = this.getCartsFromStorage();
    const existCart = carts.find(cart => cart.cartId === cartId);
  
    if (existCart) {
      throw new Error('O carrinho já existe');
    }
  
    const newCart = {
      cartId: cartId,
      products: [],
    };
  
    carts.push(newCart);
    this.saveCartsToStorage(carts);
  
    return Promise.resolve();
  }

  getCartById(cartId) {
    return new Promise((resolve, reject) => {
      const carts = this.getCartsFromStorage();
      const cart = carts.find(cart => cart.cartId === cartId);
  
      if (cart) {
        resolve(cart);
      } else {
        reject(new Error('Carrinho não encontrado'));
      }
    });
  };

  addProductToCart(cartId, productId) {
    return new Promise((resolve, reject) => {
      const carts = this.getCartsFromStorage();
      const cartIndex = carts.findIndex(cart => cart.cartId === cartId);
  
      if (cartIndex === -1) {
        reject(new Error('Carrinho não encontrado'));
        return;
      }
  
      const cart = carts[cartIndex];
      const existProduct = cart.products.find(product => product.product === productId);
  
      if (existProduct) {
        existProduct.quantity++;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
  
      this.saveCartsToStorage(carts);
      resolve();
    });
  }  
  
  getCartsFromStorage() {
    if (fs.existsSync(this.path)) {
      const fileData = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(fileData) || [];
    }
    return [];
  }

  saveCartsToStorage(carts) {
    fs.writeFileSync(this.path, JSON.stringify(carts, null, 2), 'utf-8');
  }
}

module.exports = CartsManager;