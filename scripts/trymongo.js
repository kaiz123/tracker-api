const { MongoClient } = require('mongodb');
require('dotenv').config();


const url = process.env.DB_URL || 'mongodb://localhost/issuetracker';

async function testWithAsync() {
  console.log('async await testing');
  const client = new MongoClient(url, { useNewUrlParser: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB URL', url);
    const db = client.db();
    const collection = db.collection('employees');
    const employee = { id: 2, name: 'B. Async', age: 16 };
    const result = await collection.insertOne(employee);
    console.log('Result of insert:\n', result.insertedId);
    const docs = await collection.find({ _id: result.insertedId })
      .toArray();
    console.log('Result of find:\n', docs);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

function testWithCallbacks(callback) {
  console.log('callback testing');
  const client2 = new MongoClient(url, { useNewUrlParser: true });
  client2.connect((err2, client) => {
    if (err2) {
      callback(err2);
      return;
    }
    console.log('Connected to MongoDB URL', url);

    const db = client.db();
    const collection = db.collection('employees');

    const employee = { id: 1, name: 'A. Callback', age: 23 };
    collection.insertOne(employee, (err3, result) => {
      if (err3) {
        client.close();
        callback(err3);
        return;
      }
      console.log('Result of insert:\n', result.insertedId);
      collection.find({ _id: result.insertedId })
        .toArray((err, docs) => {
          if (err) {
            client.close();
            callback(err);
            return;
          }
          console.log('Result of find:\n', docs);
          client.close();
          callback(err);
        });
    });
  });
}

testWithCallbacks((err) => {
  if (err) {
    console.log(err);
  }
  testWithAsync();
});
