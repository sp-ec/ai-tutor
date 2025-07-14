import 'dotenv/config';
import express, { Request, Response } from 'express';
import openaiRoutes from './routes/openai.route';
import cors from 'cors';


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use('/api', openaiRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});