require("dotenv").config();
const app = require('./src/index');
const connectDB = require('./src/config/db');

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});