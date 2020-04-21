/* eslint-disable react-hooks/rules-of-hooks */
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import expressStaticGzip from 'express-static-gzip';
import path from 'path';
import mongoAuth from '../exempt/mongo_auth';
import { connect as connectToDB } from './database/database';
import apiRouter from './routes/apirouter';

const app = express();

const useProductionPaths = () => {
    console.log(`Path: ${ path.join(__dirname, '../build') }`);
    app.use(expressStaticGzip(path.join(__dirname, '../build'), {
        enableBrotli: true,
        orderPreference: ['br'],
        serveStatic: {
            setHeaders: function (res, path) {
                res.setHeader('Cache-Control', 'public, max-age=31536000');
            }
        }
    }));
    // noinspection JSUnresolvedFunction
    app.get('*', function (request, response) {
        response.sendFile(path.resolve(__dirname, '../build', 'index.html'));
    });
};

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', apiRouter);
// useProductionPaths();

app.listen(3001, () => {
    console.log('Backend Express Server is running on port 3001');
    connectToDB(mongoAuth.username, mongoAuth.password, mongoAuth.database, mongoAuth.authDatabase)
        .then(() => console.log('Connected to database'))
        .catch(error => 'An error occurred connecting to the database');
});