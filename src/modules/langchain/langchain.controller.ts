import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LangchainService } from './langchain.service';
import { CreateLangchainDto } from './dto/create-langchain.dto';
import { UpdateLangchainDto } from './dto/update-langchain.dto';

@Controller('langchain')
export class LangchainController {
  constructor(private readonly langchainService: LangchainService) {}

   
}
