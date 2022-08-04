import { createServer, IncomingMessage, ServerResponse } from 'http';
import cors from "cors";
import { Route } from './route';
const cron = require('node-cron');
const axios = require('axios').default;

const date: Date = new Date();
const hostname = 'localhost'; 
const port = 7000;
let route = new Route;

const server = createServer((request: IncomingMessage, response: ServerResponse) => {
    route.handleRequests(request, response);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});






/** running a task on every minute.   
 *   * * * * * 
**/
cron.schedule('* * * * *', () => {
    console.log('running a task on every minute', date.getHours()+":"+date.getMinutes()+" "+date.getSeconds());
});