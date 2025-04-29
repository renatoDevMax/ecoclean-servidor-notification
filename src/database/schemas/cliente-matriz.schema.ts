import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClienteMatrizDocument = ClienteMatriz & Document;

@Schema({ collection: 'clienteMatriz' })
export class ClienteMatriz {
  @Prop()
  nome: string;

  @Prop()
  email: string;

  @Prop()
  telefone: string;

  @Prop()
  cnpj: string;

  @Prop()
  endereco: string;

  @Prop({ type: Object })
  dados_adicionais: Record<string, any>;
}

export const ClienteMatrizSchema = SchemaFactory.createForClass(ClienteMatriz);
