import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClienteFiliadoDocument = ClienteFiliado & Document;

@Schema({ collection: 'clienteFiliado' })
export class ClienteFiliado {
  @Prop()
  nome: string;

  @Prop()
  email: string;

  @Prop()
  telefone: string;

  @Prop()
  cpf: string;

  @Prop()
  endereco: string;

  @Prop()
  pontos: number;

  @Prop({ type: Object })
  dados_adicionais: Record<string, any>;
}

export const ClienteFiliadoSchema =
  SchemaFactory.createForClass(ClienteFiliado);
