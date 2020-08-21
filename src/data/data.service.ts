import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

const readFile = util.promisify(fs.readFile);

@Injectable()
export class DataService {
  showInstructions(): string {
    return 'Please specify file name. For example: http://localhost:4000/data/file.txt';
  }

  getFileExt(fileURL: string): string {
    const parsedFileURL = path.normalize(fileURL).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, '..\\..\\', parsedFileURL);
    const ext = path.parse(filePath).ext;

    if (ext === '') {
      throw new HttpException(
        'Please specify file extension',
        HttpStatus.BAD_REQUEST,
      );
    }

    return ext;
  }

  async getFileData(fileURL: string): Promise<Buffer> {
    const parsedFileURL = path.normalize(fileURL).replace(/^(\.\.[\/\\])+/, '');

    const filePath = path.join(__dirname, '..\\..\\', parsedFileURL);
    Logger.log(filePath, 'FilePath');

    return readFile(filePath);
  }
}
