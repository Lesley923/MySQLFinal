const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
// const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Send HTML file at root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pitterest-landingpage.html'));
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Middleware
app.use(express.json()); // for parsing application/json

// MongoDB connection string
const mongoUrl = process.env.MONGODB_URI;

// Connect to MongoDB
// const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new MongoClient(mongoUrl);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Could not connect to MongoDB', error);
    }
}

connectToDatabase();
const dbName = "yourDatabaseName";
const collectionName = "yourCollectionName";

// Define a route to insert data
app.post('/insert', async (req, res) => {
    const collection = client.db(dbName).collection(collectionName);

    try {
        // Check if the email already exists
        const existingUser = await collection.findOne({ email: req.body.email });
        if (existingUser) {
            // If email exists, send an error response
            res.status(409).send({ message: 'Email already exists' });
        } else {
            // If email doesn't exist, insert the new user
            const result = await collection.insertOne(req.body);
            res.status(201).send(result);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/data', async (req, res) => {
    const collection = client.db(dbName).collection(collectionName); // Make sure you have this line here
    try {
        const result = await collection.find().sort({ _id: -1 }).toArray();
        res.json(result); // Since limit(1) will return an array with one item
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const atlasAPIEndpoint = 'https://us-east-2.aws.data.mongodb-api.com/app/data-atbre/endpoint/data/v1';
const atlasAPIKey = process.env.ATLAS_API_KEY;
const clusterName = 'INFSCI2560';

app.get('/api.data', async (req, res) => {
    const headers = {
        'Content-Type': 'application/json',
        'api-key': atlasAPIKey
    };

    const body = {
        dataSource: clusterName,
        database: dbName,
        collection: collectionName,
        filter: {} // Modify if you want to filter the results
    };

    try {
        const endPointFunction = '/action/find'
        const apiResponse = await fetch(atlasAPIEndpoint + endPointFunction, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        const data = await apiResponse.json();
        res.send(data.documents); // Send the data to the client
    } catch (error) {
        console.error('Error fetching data from Atlas API:', error);
        res.status(500).send('Error fetching data');
    }
});

app.post('/add-data', async (req, res) => {
    //const insertData = req.body; // Data sent from the frontend to be added
    const { email, ...newData } = req.body; // Destructure the email from the body

    // First, check if the email already exists
    const findRequestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': atlasAPIKey,
        },
        body: JSON.stringify({
            dataSource: clusterName,
            database: dbName,
            collection: collectionName,
            filter: { email }, // Filter to check if the email exists
        }),
    };

    // The elements which need to send the request to API
    const requestOptions = {
        method: 'POST',
        headers: findRequestOptions.headers,
        body: JSON.stringify({
            dataSource: clusterName,
            database: dbName,
            collection: collectionName,
            document: { email, ...newData }, // The new data to insert
        }),
    };

    try {
        // Attempt to find an existing document with the same email
        const findResponse = await fetch(atlasAPIEndpoint + '/action/findOne', findRequestOptions);
        const findResult = await findResponse.json();

        // If a document with the email exists, return an error response
        if (findResult.document) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const endPointFunction = '/action/insertOne'
        const response = await fetch(atlasAPIEndpoint + endPointFunction, requestOptions);
        const result = await response.json();

        if (response.ok) {
            res.status(200).json(result);
        } else {
            res.status(response.status).json(result);
        }
    } catch (error) {
        console.error('Error adding data to MongoDB Atlas:', error);
        res.status(500).send('Error adding data');
    }
});

app.delete('/delete-data', async (req, res) => {
    const { ids } = req.body; // Array of ids to delete

    // Build the request to the MongoDB Atlas Data API
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': atlasAPIKey,
        },
        body: JSON.stringify({
            dataSource: clusterName,
            database: dbName,
            collection: collectionName,
            filter: { _id: { $in: ids.map(id => ({ $oid: id })) } }     
        }),
    };

    try {
        const response = await fetch(atlasAPIEndpoint + '/action/deleteMany', requestOptions);
        const result = await response.json();

        if (response.ok) {
            res.status(200).json(result);
        } else {
            res.status(response.status).json(result);
        }
    } catch (error) {
        console.error('Error deleting data from MongoDB Atlas:', error);
        res.status(500).send('Error deleting data');
    }
});

// Other routes and middleware...
app.get('/forecast', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'forecast.html'));
});

// Listen to port...
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

