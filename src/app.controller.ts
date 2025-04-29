import {
  Controller,
  Get,
  Post,
  Render,
  Body,
  Res,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { WhatsAppService } from './whatsapp/whatsapp.service';
import { DatabaseService } from './database/database.service';
import { ObjectId } from 'mongodb';

interface MensagemDto {
  contato: string;
  mensagem: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly whatsappService: WhatsAppService,
    private readonly databaseService: DatabaseService,
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

  @Get('api/cliente/:id')
  async buscarClientePorId(@Param('id') id: string) {
    try {
      // Validar se o ID é válido para o MongoDB
      let objectId: ObjectId;
      try {
        objectId = new ObjectId(id);
      } catch (error) {
        throw new NotFoundException('ID de cliente inválido');
      }

      const connection = this.databaseService.getConnection();

      // Busca em ambas as coleções
      const clienteFiliado = await connection
        .collection('clienteFiliado')
        .findOne({ _id: objectId });

      if (clienteFiliado) {
        // Buscar compras do cliente
        const compras = await this.buscarComprasDoCliente(clienteFiliado.nome);
        return {
          cliente: clienteFiliado,
          compras: compras,
        };
      }

      const clienteMatriz = await connection
        .collection('clienteMatriz')
        .findOne({ _id: objectId });

      if (clienteMatriz) {
        // Buscar compras do cliente
        const compras = await this.buscarComprasDoCliente(clienteMatriz.nome);
        return {
          cliente: clienteMatriz,
          compras: compras,
        };
      }

      // Se não encontrar em nenhuma coleção
      throw new NotFoundException('Cliente não encontrado');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Cliente não encontrado');
    }
  }

  private async buscarComprasDoCliente(nomeCliente: string) {
    try {
      const connection = this.databaseService.getConnection();
      const compras = await connection
        .collection('comprasFidelidade')
        .find({ nome: nomeCliente })
        .toArray();

      return compras;
    } catch (error) {
      console.error('Erro ao buscar compras do cliente:', error);
      return [];
    }
  }
}
