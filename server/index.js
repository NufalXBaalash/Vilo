const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ML_SERVICE_URL = 'http://localhost:5001';

// Middleware
app.use(cors());
app.use(express.json());

// Uploads configuration
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Keep original filename but ensure it's safe
        // We can use a timestamp prefix to avoid collisions if needed, 
        // but for now let's keep it simple as per existing logic
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Routes

// Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
        status: 'success',
        filename: req.file.filename,
        path: req.file.path
    });
});

// Proxy to ML Service
// We'll capture all other /api requests and forward them
app.use('/api', async (req, res) => {
    const url = `${ML_SERVICE_URL}/api${req.path}`;
    console.log(`Proxying request to: ${url}`);

    try {
        const response = await axios({
            method: req.method,
            url: url,
            data: req.body,
            headers: { 'Content-Type': 'application/json' }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error proxying to ML service:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'ML Service unavailable' });
        }
    }
});

// Serve React App (Production)
// For dev, we use Vite server.
// app.use(express.static(path.join(__dirname, '../client/dist')));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
