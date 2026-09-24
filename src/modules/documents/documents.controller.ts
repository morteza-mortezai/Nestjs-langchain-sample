// documents.controller.ts

import { Body, Controller, Post } from '@nestjs/common';

import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto/create-document.dto';
import { ChunkingService } from '../rag/chunking.service';
import { QuestionDto } from './dto/create-document.dto/question.dto';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly chunkingService: ChunkingService,
  ) {}

  @Post()
  create(@Body() dto: CreateDocumentDto) {
    return this.documentsService.create(dto);
  }

  @Post('chunk-test')
  chunk(@Body() dto: CreateDocumentDto) {
    return this.chunkingService.chunk(dto.content);
  }

  @Post('search')
  search(@Body() dto: QuestionDto) {
    return this.documentsService.search(dto.question);
  }
}
