import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}

  @Get()
  showInstructions() {
    return this.dataService.showInstructions();
  }

  @Get(':filename')
  getFileData(@Req() request: Request, @Res() res: Response) {
    this.dataService
      .getFileData(request.url)
      .then(data => {
        res.end(data);
      })
      .catch(err => {
        res.statusCode = 404;
        res.end(err.message);
      });
  }
}
