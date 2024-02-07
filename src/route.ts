var url = require("url");
import { Service } from './services';

export class Route {

    public service: any;
    constructor() {
        this.service = new Service;
    }

    public handleRequests(request: any, response: any) {
        const path = url.parse(request.url).pathname;
        const method = request.method;

        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token');
        response.setHeader('Access-Control-Allow-Credentials', true);

        // *,,,*///
        switch (true) {
            case path == "/" && method == 'GET':
                this.service.getResponse(response, 'Hello Api!');
                break;
            case path == "/save-post" && method == 'POST':
                // this.service.savePost(request, response);
                break;
            case path == "/get-posts" && method == 'POST':
                this.service.getPosts(request, response);
                break;
            default:
                this.service.getResponse(response, 'Api not found!');
        }
    }
}
