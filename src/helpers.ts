const jwt = require("jsonwebtoken");
const formidable = require('formidable');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const axios = require('axios').default;
const dot = require('dot-object');

export class Helper {

    public getRequest(req: any) {
        var form = new formidable.IncomingForm();
        return new Promise(function (resolve, reject) {
            form.parse(req, function (err: any, fields: any, files: any) {
                let data = { fields: fields, files: files }
                return resolve(data);
            });
        });
    }

    public getResponse(res: any, data: any) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    }

    public checkEmpty(data: any, fields: any) {
        var msg: any = [];
        fields.forEach((element: any) => {
            if (data[element] == undefined || data[element] == null || data[element] == " ") {
                msg.push(element + " field is required.");
            }
        });
        return msg;
    }

    public isEmptyObject(obj: any) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                return false;
            }
        }
        return true;
    }

    public jwtToken(id: string) {
        const jwtKey = "ramesh.com"
        const jwtExpirySeconds = 7200 //expire 7200 seconds after issue means 2hrs

        const token = jwt.sign({ id }, jwtKey, {
            algorithm: "HS256",
            expiresIn: jwtExpirySeconds,
        });
        return token;
    }

    public verifyToken(request: any) {
        const token = request.headers["x-access-token"];
        const jwtKey = "ramesh.com";
        let validKey = true;
        if (token) {
            try {
                const decoded = jwt.verify(token, jwtKey);
            } catch (err) {
                validKey = false;
            }
        } else {
            validKey = false;
        }
        return validKey;
    }

    public protectMethod(request: any, response: any) {
        if (!this.verifyToken(request)) {
            return this.getResponse(response, { status: false, message: "Unauthorized" });
        }
    }

    public fileUpload(files: any) {
        var randName = Math.floor(Date.now() / 1000);
        var folder = path.join(__dirname, 'uploads') + '/';
        var randFileName = randName + '-';

        return new Promise(function (resolve, reject) {
            var oldpath = files.pic.filepath;
            var newpath = folder + randFileName + files.pic.originalFilename;
            var fileName = randFileName + files.pic.originalFilename;
            var ext = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

            if (!ext.includes(files.pic.mimetype)) {
                return resolve(false);
                console.log('Invalid file format');
            }

            /*** saving file in the local folder **/
            var rawData = fs.readFileSync(oldpath)
            fs.writeFile(newpath, rawData, function (err: any) {
                if (err) throw err;
                console.log(err);
                console.log('Successfully uploaded in the local folder');
            }) /*** saving file in the local folder **/

            let data = { status: true, fileUrl: newpath, fileName: files.pic.originalFilename };
            return resolve(data);

        });
    }

    public TBL(postType: any) {
        if (postType == 1) {
            return 'blogs';
        } else if (postType == 2) {
            return 'articles';
        }
    }


}
