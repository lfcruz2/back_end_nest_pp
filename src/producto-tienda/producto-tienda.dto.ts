import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class ProductoTiendaDTO {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsNumber()
  @IsNotEmpty()
  readonly cantidad: number;

  @IsString()
  @IsNotEmpty()
  readonly productoId: string;

  @IsString()
  @IsNotEmpty()
  readonly tiendaId: string;
}
