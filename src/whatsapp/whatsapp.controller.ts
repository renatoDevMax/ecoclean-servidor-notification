import { Controller, Get, Post, Body } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';

interface MensagemDto {
  contato: string;
  mensagem: string;
}

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Get('status')
  getStatus() {
    return this.whatsappService.getStatus();
  }

  @Get('contatos')
  async getContatos() {
    return await this.whatsappService.getContatos();
  }

  @Post('/mensagem')
  async enviarMensagem(@Body() mensagemDto: MensagemDto) {
    const { contato, mensagem } = mensagemDto;
    const success = await this.whatsappService.enviarMensagem(
      contato,
      mensagem,
    );

    return { mensagemEnviada: success };
  }
}
