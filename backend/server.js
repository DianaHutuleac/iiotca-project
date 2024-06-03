const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const awsIot = require('aws-iot-device-sdk');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { fromNodeProviderChain } = require('@aws-sdk/credential-providers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  ws.send(JSON.stringify({ message: 'WebSocket connection established' }));
});

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// AWS IoT configuration
const device = awsIot.device({
  keyPath: './private.pem.key',
  certPath: './certificate.pem.crt',
  caPath: './AmazonRootCA1.pem',
  clientId: 'my-raspberry-pi',
  host: 'a2mhzr5pajzcqt-ats.iot.eu-north-1.amazonaws.com'
});

device.on('connect', () => {
  console.log('Connected to AWS IoT');
  device.subscribe('rfid/id');
});

let rfidScans = [];

device.on('message', (topic, payload) => {
  console.log('Message received:', topic, payload.toString());
  if (topic === 'rfid/id') {
    const rfidData = JSON.parse(payload.toString());
    handleScannedID(rfidData.id);
  }
});

function handleScannedID(scannedID) {
  console.log('Scanned RFID ID:', scannedID);
  const timestamp = new Date().toISOString();
  const scanData = { id: scannedID, timestamp };
  rfidScans.push(scanData);
  if (rfidScans.length > 100) {
    rfidScans.shift(); // Keep only the latest 100 scans
  }
  broadcast(scanData); // Broadcast the new scan to all WebSocket clients
}

const client = new DynamoDBClient({
  region: 'eu-north-1',
  credentials: fromNodeProviderChain(),
});
const dynamoDb = DynamoDBDocumentClient.from(client);

const USERS_TABLE = 'Bookshelf_Users';
const BOOKS_TABLE = 'BooksTable';
const JWT_SECRET = process.env.JWT_SECRET || 'your_generated_secret_key';

app.post('/confirm-borrow', async (req, res) => {
  const { bookId, userId } = req.body;

  if (!bookId || !userId) {
    return res.status(400).send('bookId and userId are required');
  }

  const params = {
    TableName: BOOKS_TABLE,
    Key: { BookID: bookId },
    UpdateExpression: 'set borrowed = :borrowed, borrowedBy = :userId',
    ExpressionAttributeValues: {
      ':borrowed': true,
      ':userId': userId,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    const result = await dynamoDb.send(new PutCommand(params));
    res.json(result.Attributes);
  } catch (error) {
    console.error('Error updating book status:', error);
    res.status(500).send('Error updating book status');
  }
});

app.post('/trigger-scan', (req, res) => {
  const message = JSON.stringify({ action: 'start-scan' });
  const topic = 'rfid/id';

  device.publish(topic, message, (err) => {
    if (err) {
      res.status(500).send('Failed to trigger scan');
    } else {
      res.send('Scan triggered');
    }
  });
});

app.get('/books', async (req, res) => {
  const params = {
    TableName: BOOKS_TABLE,
  };

  try {
    const result = await dynamoDb.send(new ScanCommand(params));
    res.json(result.Items);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Error fetching books');
  }
});

app.get('/rfid-scans', (req, res) => {
  res.json(rfidScans);
});

app.post('/borrow', async (req, res) => {
  const { bookId, desiredPin } = req.body;

  if (!bookId || !desiredPin) {
    return res.status(400).send('bookId and desiredPin are required');
  }

  const message = JSON.stringify({ rfid: 'scan', desired_pin: desiredPin });
  const topic = 'gpio/control';

  device.publish(topic, message, (err) => {
    if (err) {
      return res.status(500).send('Failed to borrow book');
    }

    new Promise((resolve, reject) => {
      pendingScanResolve = resolve;
      setTimeout(() => {
        if (pendingScanResolve) {
          pendingScanResolve = null;
          reject('Scan timeout');
        }
      }, 30000);
    })
      .then((scannedID) => {
        res.send({ message: 'Borrowing process completed', scannedID });
      })
      .catch((error) => {
        res.status(500).send('RFID scan failed or timed out');
      });
  });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username (email) and password are required');
  }

  try {
    const uid = await new Promise((resolve, reject) => {
      pendingScanResolve = resolve;

      const message = JSON.stringify({ action: 'start-scan' });
      const topic = 'register/scan';

      device.publish(topic, message, (err) => {
        if (err) {
          reject('Failed to trigger scan');
        }
      });

      setTimeout(() => {
        if (pendingScanResolve) {
          pendingScanResolve = null;
          reject('Scan timeout');
        }
      }, 30000);
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
      TableName: USERS_TABLE,
      Item: {
        UID: uid,
        Username: username,
        Password: hashedPassword,
      },
    };

    await dynamoDb.send(new PutCommand(params));
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username (email) and password are required');
  }

  const params = {
    TableName: USERS_TABLE,
    IndexName: 'Username-index',
    KeyConditionExpression: 'Username = :username',
    ExpressionAttributeValues: {
      ':username': username,
    },
  };

  try {
    const result = await dynamoDb.send(new QueryCommand(params));
    if (result.Items.length === 0) {
      return res.status(400).send('User not found');
    }

    const user = result.Items[0];
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid password');
    }

    const token = jwt.sign({ UID: user.UID, Username: user.Username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
