import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {});
});

router.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts');
});

router.post('/save-product', (req, res) => {
    const productData = req.body;

    socketServer.emit('product', productData);

    res.sendStatus(200);
});

export default router;
