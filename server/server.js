import express from 'express';
import bodyParser from 'body-parser';
import apiRouter from "./routes/apirouter";
import mongoAuth from '../exempt/mongo_auth';
import {connect as connectToDB} from "./database/database";

const app = express();

app.use(bodyParser.json());
app.use('/api', apiRouter);

app.get('/', (req, res) => {
});

app.listen(3001, () => {
    console.log(`Backend Express Server is running on port 3001`);
    connectToDB(mongoAuth.username, mongoAuth.password, mongoAuth.database, mongoAuth.authDatabase)
        .then(() => console.log(`Connected to database`))
        .catch(error => "An error occurred connecting to the database");
});