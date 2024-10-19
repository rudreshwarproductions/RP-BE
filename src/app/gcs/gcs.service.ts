import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GcsService {
  private storage = new Storage({
    keyFilename: 'key.json', // Path to your GCS service account key file
  });

  constructor(private configService: ConfigService) {}

  private bucket = this.storage.bucket(
    this.configService.get<string>('gcp.bucket'),
  ); // Your GCS bucket name

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    email: string,
    index?: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileType = extname(file.originalname);

      const uniqueFileName = `${folder}/${email}${index || index <= 0 ? `-${index + 1}` : ''}${fileType}`;
      const blob = this.bucket.file(uniqueFileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${uniqueFileName}`;
        resolve(publicUrl);
      });

      blobStream.on('error', (err) => {
        reject(err);
      });

      blobStream.end(file.buffer); // Send the file buffer to GCS
    });
  }
}
