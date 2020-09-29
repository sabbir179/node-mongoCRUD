const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const password = 'AUSTcanada*1212';

const uri = "mongodb+srv://organicUser:AUSTcanada*1212@cluster0.erp1b.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // connect with index.html
})


// collect data form client side (frontend input from) to server side (backend / database)

client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");
    
  // read data from database [api create]
    app.get("/products", (req, res) => {
        productCollection.find({})
        .toArray( (err,documents) => {
            res.send(documents)
        })
    })
    


    // single product loading system in database

    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })


    // create data into database from frontend
    app.post("/addProduct", (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
        .then((result) => {
            console.log('data added successfully')
            res.redirect('/')
        } )
    })



// update data


    app.patch('/update/:id', (req, res) => {
        productCollection.updateOne({ _id: ObjectId(req.params.id)},
        {
            $set: {price: req.body.price, quantity:req.body.quantity}
        })
        .then(result =>{
            res.send(result.modifiedCount > 0)
        } )
    })

// delete from database
    app.delete('/delete/:id', (req, res) =>{
        // console.log(req.params.id);
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(  result => {
            res.send(result.deletedCount > 0)
        })
    })
  
});


app.listen(5000);