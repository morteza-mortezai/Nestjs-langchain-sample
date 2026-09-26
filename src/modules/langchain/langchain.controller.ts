import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LangchainService } from './langchain.service';
import { CreateLangchainDto } from './dto/create-langchain.dto';
import { UpdateLangchainDto } from './dto/update-langchain.dto';
import { QuestionDto } from '../documents/dto/create-document.dto/question.dto';

@Controller('langchain')
export class LangchainController {
  constructor(private readonly langChainService: LangchainService) {}

  @Get('embedding')
  embedding() {
    return this.langChainService.testEmbedding();
  }

  @Get('llm')
  llm() {
    return this.langChainService.testLlm();
  }

  @Post('search')
  search(@Body() dto: QuestionDto) {
    return this.langChainService.ask3(dto.question);
  }
}
