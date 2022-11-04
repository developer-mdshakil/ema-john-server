const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//encrypted database
require('dotenv').config()

//midware here
app.use(cors())
app.use(express.json())

app.get('/', (req, res)=> {
    res.send('Ema-john database server done!!')
})

//mongodb database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASSWORD}@cluster0.io31lql.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const serviceCollection = client.db('ema-john').collection('services');
        app.get('/products', async(req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = serviceCollection.find(query);
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await serviceCollection.estimatedDocumentCount()
            res.send({count, products})
        })

        app.post('/poductByIds', async(req, res)=> {
            const ids = req.body;
            const objectId = ids.map(id => ObjectId(id))
            const query = {_id: {$in: objectId}};
            const cursor = serviceCollection.find(query)
            const products = await cursor.toArray()
            res.send(products)
        })
    }
    finally{

    }
}
run().catch(err => console.log(err))


app.listen(port, ()=> {
    console.log(`Ema-john server runnin on: ${port}`)
})