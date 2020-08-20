import { Injectable } from '@nestjs/common';

@Injectable()
export class DataService {
  showInstructions(): string {
    return 'Please specify file name. For example: http://localhost:4000/data/file.txt';
  }

  getFileData(fileName: string): string {
    return fileName;
  }
}
