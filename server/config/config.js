// ====================================
// Puerto
// ====================================
process.env.PORT = process.env.PORT || 3000;

// ====================================
// Entorno
// ====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================================
// Base de datos
// ====================================
let urlDB;

if (process.env.NODE_ENV === 'dev') urlDB = 'mongodb://localhost:27017/cafe';
else urlDB = 'mongodb+srv://omar90:s7Df5DHacQ4T86aj@cluster0.xi5k6.mongodb.net/cafe';

urlDB = 'mongodb+srv://omar90:s7Df5DHacQ4T86aj@cluster0.xi5k6.mongodb.net/cafe';

process.env.URLDB = urlDB;