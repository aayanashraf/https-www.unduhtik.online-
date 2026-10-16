const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Sirf 'public' folder ko static serve karein (Root folder ko nahi)
app.use(express.static(path.join(__dirname, 'public')));

// 2. Sahi path dein jo 'public/index.html' ko point kare
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});