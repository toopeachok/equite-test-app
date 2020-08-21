import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { DataService } from './data.service';

const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.doc': 'application/msword',
  '.eot': 'application/vnd.ms-fontobject',
  '.ttf': 'application/x-font-ttf',
};

@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}

  @Get()
  showInstructions() {
    return this.dataService.showInstructions();
  }

  @Get(':filename')
  getFileData(@Req() request: Request, @Res() res: Response) {
    const ext = this.dataService.getFileExt(request.url);

    this.dataService
      .getFileData(request.url)
      .then(data => {
        res.setHeader('Content-type', mimeType[ext] || 'text/plain');
        res.end(data);
      })
      .catch(err => {
        res.statusCode = 404;
        res.end(err.message);
      });
  }
}
