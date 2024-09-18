import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './app/routes';

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use('/api', router);


app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Project is running successfully'
    });
});


//This is used for throwing error for unknown routes

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});


export default app;