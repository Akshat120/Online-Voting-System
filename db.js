require('dotenv').config()
const port = process.env.PORT || 3000
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  module.exports = client
  const app = require('./app') 
  app.listen(port,()=>{
    console.log('Server Started.')
  }) 
});

