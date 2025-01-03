import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import app from './app';
const port = process.env.PORT;


app.listen(port || 3001, () => {
  console.log(`Server running on http://localhost:${port}, You better catch it!`);
});