import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';

export class ProductoDTO {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsEnum(['Perecedero', 'No perecedero'])
  @IsNotEmpty()
  readonly categoria: string;

  @IsNumber()
  @IsNotEmpty()
  readonly precio: number;
}
