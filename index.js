const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.tyenc.mongodb.net/<dbname>?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
client.connect((err) => {
    const productsCollation = client
        .db('ema-jhon-store')
        .collection('products');
    console.log('i am connected');
    const ordersCollation = client.db('ema-jhon-store').collection('orders');
    console.log('i am connected');

    app.get('/', (req, res) => {
        res.send('working');
    });

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        console.log(products);
        productsCollation.insertOne(products).then((result) => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0);
        });
    });
    app.get('/products', (req, res) => {
        productsCollation.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });
    app.get('/product/:key', (req, res) => {
        productsCollation
            .find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            });
    });
    app.post('/productsByKeys', (req, res) => {
        const productsKeys = req.body;
        productsCollation
            .find({ key: { $in: productsKeys } })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });
    app.post('/addOrders', (req, res) => {
        const orders = req.body;
        ordersCollation.insertOne(orders).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });
});

app.listen(precess.env.PORT || 5000);
