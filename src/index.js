import express from 'express';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import fs from 'fs';

const app = express();
const server = app.listen(8080, () => console.log('Servidor rodando na porta 8080'));

const socketServer = new Server(server);

const viewFolder = 'views';

app.engine('handlebars', handlebars.engine());
app.set('views', viewFolder);
app.set('view engine', 'handlebars');
app.use('/', viewsRouter);

const productsData = fs.readFileSync('products.json', 'utf-8');
const products = JSON.parse(productsData);

app.get('/', (req, res) => {
    res.render('home', { products });
  });

  socketServer.on('connection', socket => {
    console.log('Novo produto');

    socket.on('product', data => {
      console.log(`Produto cadastrado ${data}`);
      const id = products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;
      const dataList = { id, ...data }
      products.push(dataList);
      fs.writeFileSync('products.json', JSON.stringify(products, null, 2), 'utf-8');
      socketServer.emit('product', products);
    });
  });

socketServer.on('disconnect', () => {
    console.log('Usuario desconectao');
});
