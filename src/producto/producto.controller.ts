import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { ProductoEntity } from './producto.entity';
import { ProductoDTO } from './producto.dto';
import { ValidationError } from 'class-validator';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

@Controller('producto')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get()
  async findAll() {
    return await this.productoService.findAll();
  }

  @Get(':productoId')
  async findOne(@Param('productoId') productoId: string) {
    return await this.productoService.findOne(productoId);
  }

  private validateTipoProducto(categoria: string): void {
    console.debug(categoria);
    const tiposValidos = ['perecedero', 'no perecedero'];
    const categoriaEnMinusculas = categoria.toLowerCase();
    console.debug(!tiposValidos.includes(categoriaEnMinusculas));
    if (!tiposValidos.includes(categoriaEnMinusculas)) {
      throw new BusinessLogicException(
        'Invalid product type. Must be Perecedero or No perecedero.',
        BusinessError.BAD_REQUEST,
      );
    }
  }

  @Post()
  async create(@Body() productoDto: ProductoDTO) {
    this.validateTipoProducto(productoDto.categoria);
    try {
      const producto: ProductoEntity = plainToInstance(
        ProductoEntity,
        productoDto,
      );
      return await this.productoService.create(producto);
    } catch (error) {
      console.error(error);
      if (error instanceof ValidationError) {
        console.error(error);
        throw new BadRequestException('Error de validación en el DTO');
      }
      if (error instanceof BusinessLogicException) {
        console.error(error);
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'error.message',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @Put(':productoId')
  async update(
    @Param('productoId') productoId: string,
    @Body() productoDto: ProductoDTO,
  ) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    this.validateTipoProducto(productoDto.categoria);
    return await this.productoService.update(productoId, producto);
  }

  @Delete(':productoId')
  @HttpCode(200)
  async delete(@Param('productoId') productoId: string) {
    await this.productoService.delete(productoId);
    return { message: 'Product deleted successfully' };
  }
}
