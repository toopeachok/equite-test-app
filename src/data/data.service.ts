import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

const readFile = util.promisify(fs.readFile);

@Injectable()
export class DataService {
  showInstructions(): string {
    return 'Please specify file name. For example: http://localhost:4000/data/file.txt';
  }

  async getFileData(fileName: string): Promise<Buffer> {
    const parsedFileName = path
      .normalize(url.parse(fileName).pathname)
      .replace(/^(\.\.[\/\\])+/, '');

    const filePath = path.join(__dirname, '..\\..\\', parsedFileName);
    Logger.log(filePath, 'GetFileData');

    const ext = path.parse(parsedFileName).ext;

    if (ext === '') {
      throw new HttpException(
        'Please specify file extension',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return readFile(filePath);
    }
  }
}
