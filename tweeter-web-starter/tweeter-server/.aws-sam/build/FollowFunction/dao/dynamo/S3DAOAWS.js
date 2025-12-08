"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3DAOAWS = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class S3DAOAWS {
    bucketName = process.env.BUCKET_NAME;
    region = process.env.REGION;
    s3Client = new client_s3_1.S3Client({});
    async getImageUrl(key) {
        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/image/${key}`;
    }
    async uploadImage(key, data) {
        const fullKey = `image/${key}`;
        await this.s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: fullKey,
            Body: data,
            ContentType: "image/png"
        }));
        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/image/${key}`;
    }
}
exports.S3DAOAWS = S3DAOAWS;
