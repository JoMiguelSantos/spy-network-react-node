const fs = require("fs");
const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.uploadFileS3 = (req, res, next) => {
    if (!req.file) {
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: secrets.S3_BUCKET,
            ACL: "public-read",
            Key: `${req.session.userId}/${filename}`,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            next();
            fs.unlink(path, () => {});
            req.s3file = "";
        })
        .catch((err) => {
            console.log(err);
            return res.sendStatus(500);
        });
};

function emptyBucket(bucketName) {
    let currentData;
    let params = {
        Bucket: bucketName,
        Prefix: "folder/",
    };

    return S3.listObjects(params)
        .promise()
        .then((data) => {
            if (data.Contents.length === 0) {
                throw new Error("List of objects empty.");
            }

            currentData = data;

            params = { Bucket: bucketName };
            params.Delete = { Objects: [] };

            currentData.Contents.forEach((content) => {
                params.Delete.Objects.push({ Key: content.Key });
            });

            return S3.deleteObjects(params).promise();
        })
        .then(() => {
            if (currentData.Contents.length === 1000) {
                emptyBucket(bucketName, callback);
            } else {
                return true;
            }
        });
}

exports.deleteFolderS3 = (req, res, next) => {
    let currentData;
    let params = {
        Bucket: secrets.S3_BUCKET,
        Prefix: `${req.params.user_id}/`,
    };

    const listPromise = s3.listObjects(params).promise();

    listPromise.then((data) => {
        if (data.Contents.length === 0) {
            throw new Error("List of objects empty.");
        }

        currentData = data;

        params = { Bucket: secrets.S3_BUCKET };
        params.Delete = { Objects: [] };

        currentData.Contents.forEach((content) => {
            params.Delete.Objects.push({ Key: content.Key });
        });

        const deletePromise = s3.deleteObjects(params).promise();
        deletePromise
            .then(() => {
                console.log(`folder ${req.params.user_id} deleted`);
                next();
            })
            .catch((err) => {
                console.log(err);
            });
    });
};
