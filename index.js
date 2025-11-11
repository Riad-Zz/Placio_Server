require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//----------------Initial Port and Connections-------------------------
const app = express();
const port = process.env.PORT || 3000;

//-----------------MiddleWire-------------------------
app.use(cors());
app.use(express.json());

//-------------------Test Api------------------------
app.get("/", (req, res) => {
  res.send("Placio Server Api! ");
});

const uri = process.env.MONGO_URI;

//--------------Mongo Client---------------------------------
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


//------------------------Connection to Mongo DB---------------------------
async function run() {
  try {
//---------------------- Reminder->Comment this Out when deploying to vercel----------------------
    await client.connect();
    
//-------------------------Databases & all Collection here-----------------------------
    const dataBase = client.db("Placio") ;
    const placioProperties = dataBase.collection("properties") ;
    const userCollection = dataBase.collection("users") ;
    const ratingCollection = dataBase.collection('rating')

    //--------------------All api here ---------------------------------------

    //*************************** APIS RELATED TO PROPERTY *******************************************/

    //-----------------------Simple Post api to Add property------------------------
    app.post('/property', async(req,res)=>{
        const newProperty = req.body ;
        const result = await placioProperties.insertOne(newProperty) ;
        res.send(result) ;
    })

    //----------------------Simple Api to get Property ------------------------
    app.get('/property' , async(req,res)=>{
        const email = req.query.sellerEmail ;
        const query = {} ;
        if(email){
          query.sellerEmail = email
        }
        const sortType = {price : 1}
        const cursor =await placioProperties.find(query).sort(sortType) ;
        const result =await cursor.toArray() ;
        res.send(result) ;
    })

    app.get('/property/:id' , async(req,res)=>{
      const userID = req.params.id ;
      const query = {_id : new ObjectId(userID)} ; 
      const result =await placioProperties.findOne(query)
      res.send(result) ;
    })

    app.get('/recentproperty' , async(req,res)=>{
      const limitt = 6 ;
      const query = {} ;
      const sortType = {postedOn : -1} ;
      const cursor = await placioProperties.find(query).sort(sortType).limit(limitt)
      const result = await cursor.toArray() ;
      res.send(result) ;
    })

    //*************************** APIS RELATED TO USERS *******************************************/
    app.post('/users' , async(req,res) => {
      const newUser = req.body ; 
      const email = req.body.email ;

      const query = {email : email} ;
      const existingEmail =await userCollection.findOne(query) ;
      if(existingEmail){
        res.send("User Already Exist")
      }else{
        const result = await userCollection.insertOne(newUser) ;
        res.send(result) ;
      }
    })

    app.get('/users' , async(req,res)=>{
      const cursor =await userCollection.find() ;
      const result = await cursor.toArray() ;
      res.send(result) ;
    })

    //*************************** APIS RELATED TO Rating *******************************************/
    app.get('/rating' , async(req,res)=>{
      const email = req.query.Reviewer;
      const query = {} 
      if(email){
        query.Reviewer = email
      }
      const cursor = await ratingCollection.find(query)
      const result = await cursor.toArray() ;
      res.send(result)
    })

    app.post('/rating',async(req,res)=>{
      const newRating = req.body ;
      const result = await ratingCollection.insertOne(newRating) ;
      res.send(result) ;
    })

    //----------------------- Reminder  -> Comment this Out when deploying to vercel
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Sever is Running on port : ${port}`);
});
