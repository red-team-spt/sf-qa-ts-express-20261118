import express from 'express';
import helmet from 'helmet';
import { documents } from './routes/documents';
import { uploads } from './routes/uploads';

const app = express();
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use('/documents', documents);
app.use('/uploads', uploads);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(Number(process.env.PORT ?? 3000));
