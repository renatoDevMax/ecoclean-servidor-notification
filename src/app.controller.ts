import { Controller, Get, Post, Render, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { WhatsAppService } from './whatsapp/whatsapp.service';

interface MensagemDto {
  contato: string;
  mensagem: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly whatsappService: WhatsAppService,
  ) {}

  @Get()
  @Render('index')
  root() {
    return {};
  }

  @Post('mensagem')
  async enviarMensagem(@Body() mensagemDto: MensagemDto) {
    const { contato, mensagem } = mensagemDto;
    const success = await this.whatsappService.enviarMensagem(
      contato,
      mensagem,
    );

    return { mensagemEnviada: success };
  }
}
