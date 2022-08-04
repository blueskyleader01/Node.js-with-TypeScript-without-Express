import e from 'cors';
import { PgsDb } from './dbPg';
import { Helper } from './helpers';

export class Service extends Helper {

    public pgDb = new PgsDb;
    public res = {};

    /*
    * Saving data in the table
    * @param form data - title, description, author, pic     // pic is optional
    * Returns true or false and message
    */
    public async savePost(request: any, response: any, postType?: number) {
        this.protectMethod(request, response); /* this is for the Authorization, loggedIn user can access this route **/

        //let Type = (typeof postType !== 'undefined')?'linkedIN':postType;
        let requestData = await this.getRequest(request);
        let data = JSON.parse(JSON.stringify(requestData));

        let validation = this.checkEmpty(data.fields, ['title', 'description', 'author']);
        if (!this.isEmptyObject(validation)) {
            this.res = { status: false, message: 'Some fields are required.', data: validation };
            return this.getResponse(response, this.res);
        }

        const TBL = this.TBL(postType);
        let select = 'title, description, author';
        let query = "INSERT INTO " + TBL + " (" + select + ") " +
            " VALUES ('" + data.fields.title + "', '" + data.fields.description + "', '" + data.fields.author + "' ) RETURNING *";

        let blog_id = await this.pgDb.sqlQueryExce(query);
        if (blog_id) {
            this.res = { status: true, message: 'Successful saved' };
            if (!this.isEmptyObject(data.files)) {
                var uploadData = await this.fileUpload(data.files);
                if (uploadData) {
                    this.blogImageSave(uploadData, blog_id);
                    this.res = { status: true, message: 'Successful saved', data: uploadData };
                } else {
                    this.res = { status: false, message: 'Invalid file format1' };
                }
            }
        } else {
            this.res = { status: false, message: 'Oops, going somthing wrong' };
        }

        return this.getResponse(response, this.res);
    }

    /*
    * Get all posts from the table
    * Returns rows
    */
    public async getPosts(request: any, response: any, postType?: number) {
        this.protectMethod(request, response);   /* this is for the Authorization, loggedIn user can access this route **/

        const TBL = this.TBL(postType);
        let select = 'b.id, b.title, b.description, b.date_published, im.file_name, im.file_url';
        const query = "SELECT " + select + " FROM " + TBL + " as b LEFT JOIN images as im ON b.id = im.post_id order by b.date_published desc";
        let data = await this.pgDb.getRows(query);
        let dt = JSON.parse(JSON.stringify(data));
        return this.getResponse(response, data);
    }


    /*
    *
    * saving image in the images table base on the post id
    * @param file_name, post_id
    * Returns true or false and message
    */
    public async blogImageSave(uploadData: any, blog_id: any) {
        let select = 'post_id, file_url, file_name';
        let checkDuplicate = await this.pgDb.getRows("SELECT " + select + " FROM images where post_id = '" + blog_id + "' AND main = 0");
        let qry;

        if (this.isEmptyObject(checkDuplicate)) {
            qry = "INSERT INTO images (" + select + ") VALUES ('" + blog_id + "', '" + uploadData.fileUrl + "' " +
                ", '" + uploadData.fileName + "') RETURNING *";

        } else {
            let select = 'post_id, file_url, file_name, main';
            qry = "INSERT INTO images (" + select + ") VALUES ('" + blog_id + "', '" + uploadData.fileUrl + "' " +
                ", '" + uploadData.fileName + "' , 1) RETURNING *";
        }

        let insertResult = await this.pgDb.sqlQueryExce(qry);
        return insertResult;
    }


}

