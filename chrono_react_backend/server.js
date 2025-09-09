const app = require('./app');
const PORT = process.env.PORT || 3000;

console.log("✅ server.js loaded");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});