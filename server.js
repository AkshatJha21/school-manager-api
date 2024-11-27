import express from "express";
import bodyParser from 'body-parser';
import schoolRoutes from './routes/school.js';

const app = express();

app.use(bodyParser.json());
app.use('/api', schoolRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
