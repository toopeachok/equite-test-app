import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

import * as memoryCache from 'memory-cache';

const readFile = util.promisify(fs.readFile);
const accessFile = util.promisify(fs.access);

const filesMetaInfo = {};

@Injectable()
export class DataService {
  showInstructions(): string {
    return 'Please specify file name. For example: http://localhost:4000/data/file.txt';
  }

  getFilePath(fileURL: string): string {
    const parsedFileURL = path.normalize(fileURL).replace(/^(\.\.[\/\\])+/, '');

    return path.join(__dirname, '..\\..\\', parsedFileURL);
  }

  getFileExt(fileURL: string): string {
    const filePath = this.getFilePath(fileURL);
    const ext = path.parse(filePath).ext;

    if (ext === '') {
      throw new HttpException(
        'Please specify file extension',
        HttpStatus.BAD_REQUEST,
      );
    }

    return ext;
  }

  async getFileData(fileURL: string): Promise<any> {
    const filePath = this.getFilePath(fileURL);
    Logger.log(filePath, 'FilePath');

    return accessFile(filePath).then(() => {
      const cachedData = memoryCache.get(filePath);

      if (cachedData) {
        Logger.log('Getting file data from a cache', 'MemoryCacheGet');
        return cachedData;
      } else if (
        !filesMetaInfo[filePath] ||
        !filesMetaInfo[filePath].isReading
      ) {
        filesMetaInfo[filePath] = { isReading: true };

        return readFile(filePath).then(data => {
          filesMetaInfo[filePath] = { isReading: false };
          memoryCache.put(filePath, data, 10000);
          Logger.log('Getting file data from a disk', 'ReadFile');

          return data;
        });
      } else {
        throw new HttpException(
          'File is already reading',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    });
  }
}
