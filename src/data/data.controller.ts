import { Controller, Get, Param } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}

  @Get()
  showInstructions() {
    return this.dataService.showInstructions();
  }

  @Get(':filename')
  getFileData(@Param('filename') fileName: string) {
    return this.dataService.getFileData(fileName);
  }
}
