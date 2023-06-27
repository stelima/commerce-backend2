const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ProductManager = require('./productManager.js');
const CartManager = require('./cartsManager.js');
const productManager = new ProductManager('products.json');
const cartManager = new CartManager('carts.json');


app.use(bodyParser.json());
const router = express.Router();
const productsRoute = '/api/products';
const cartsRoute = '/api/carts';

router.get(`${productsRoute}/`, (req, res) => {
  const { limit} = req.query;
  const products = productManager.getProducts();

  if (limit) {
    const limitedProducts = products.slice(0, limit);
    res.json(limitedProducts);
  } else {
    res.json(products);
  }
  res.send('Lista de produtos:');
});

router.get(`${productsRoute}/:id`, (req, res) => {
  const productId = parseInt(req.params.id); 
  const product = productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Produto não encontrado :(' });
  }
  res.send('Produto com o id informado:');
});

router.post(`${productsRoute}/`, (req, res) => {
  const product = req.body;
  res.send('Novo produto adicionado! :D');
});

router.put(`${productsRoute}/:id`, (req, res) => {
  const productId = parseInt(req.params.id);
  const { title, description, price, code, stock, status, thumbnails } = req.body;

  if (!title || !description || !price || !code || !stock || !status) {
    res.status(400).json({ error: 'Todos os campos (exceto thumbnails) são obrigatórios' });
    return;
  }

  const updated = productManager.updateProduct(productId, {
    title,
    description,
    price,
    code,
    stock,
    status,
    thumbnails,
  });

  if (updated) {
    res.json({ message: 'Produto atualizado com sucesso! :D' });
  } else {
    res.status(404).json({ error: 'Produto não encontrado :(' });
  }
});

router.delete(`${productsRoute}/:id`, (req, res) => {
  const productId = parseInt(req.params.id);
  const deleted = productManager.deleteProduct(productId);

  if (deleted) {
    res.json({ message: 'Produto excluído com sucesso! :D' });
  } else {
    res.status(404).json({ error: 'Produto não encontrado :(' });
  }
});

router.post(`${cartsRoute}/`, (req, res) => {
  const { cartId } = req.body;
  cartManager.createCart(cartId)
    .then(() => {
      res.status(201).json({ message: 'Novo carrinho criado!' });
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
});

router.get(`${cartsRoute}/:id`, (req, res) => {
  const cartId = parseInt(req.params.id);
  cartManager.getCartById(cartId)
    .then(cart => {
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).json({ error: 'Carrinho não encontrado' });
      }
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
});

router.post(`${cartsRoute}/:cartId/product/:productId`, (req, res) => {
  const cartId = parseInt(req.params.cartId);
  const productId = parseInt(req.params.productId);

  cartManager.addProductToCart(cartId, productId)
    .then(() => {
      res.json({ message: 'Produto adicionado ao carrinho!' });
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
});

app.use(router);

app.listen(8080, () => {
  console.log('Servidor rodando na porta 8080');
});
