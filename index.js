const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const { DB_NAME, DB_PASS, DB_USER } = process.env
const app = express()
app.use(cors())
app.use(bodyParser.json())

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.mlivs.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const blogsCollection = client.db("blogger-dairies").collection("blogs");
    const adminsCollection = client.db("blogger-dairies").collection("admins");

    app.post('/addBlog', (req, res) => {
        const newBlog = req.body
        blogsCollection.insertOne(newBlog)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body
        adminsCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });


    app.get('/admin', (req, res) => {
        const userEmail = req.query.email
        adminsCollection.find({ email: userEmail })
            .toArray((error, document) => {
                res.send(document)
            })
    })
    app.get('/allBlogs', (req, res) => {

        blogsCollection.find({})
            .toArray((error, document) => {
                res.send(document)
            })
    })
    app.get('/manageProducts', (req, res) => {
        const userEmail = req.query.email
        productsCollection.find({email: userEmail})
            .toArray((error, document) => {
                res.send(document)
            })
    })
    app.delete('/deleted/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        blogsCollection.deleteOne({ _id: id })
            .toArray((error, document) => {
                res.send(document[0])
            })
    })
    app.get('/single-blog/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        blogsCollection.find({ _id: id })
            .toArray((error, document) => {
                res.send(document[0])
            })
    });


});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || 3003)