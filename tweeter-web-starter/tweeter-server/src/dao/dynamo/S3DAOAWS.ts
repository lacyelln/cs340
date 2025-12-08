import { S3DAO } from "../interfaces/S3DAO";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export class S3DAOAWS implements S3DAO{
    private bucketName = process.env.BUCKET_NAME!;
    private region = process.env.REGION!;
    private s3Client = new S3Client({});

    async getImageUrl(key: string): Promise<string> {
        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/image/${key}`;
    }
    async uploadImage(key: string, data: Buffer): Promise<string> {
        const fullKey = `image/${key}`;

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucketName, 
                Key: fullKey, 
                Body: data, 
                ContentType: "image/png"
            })
        )
        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/image/${key}`;
    }
}