import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME!;
  }

  async uploadImage(fileBuffer: Buffer, fileType: string): Promise<string> {
    const fileKey = `images/${uuidv4()}.${fileType}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: `image/${fileType}`,
    });
    await this.s3.send(command);
    return fileKey;
  }

  async getPresignedUrl(fileKey: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });
    // Use GetObjectCommand for presigned GET URL
    const { GetObjectCommand } = await import("@aws-sdk/client-s3");
    const getCommand = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });
    return await getSignedUrl(this.s3, getCommand, { expiresIn: 3600 });
  }
}
