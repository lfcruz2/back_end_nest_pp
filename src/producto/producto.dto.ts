import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ProductoDTO {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsString()
  @IsNotEmpty()
  readonly categoria: string;

  @IsNumber()
  @IsNotEmpty()
  readonly precio: number;
}
