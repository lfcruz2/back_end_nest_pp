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
import { TiendaService } from './tienda.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { TiendaEntity } from './tienda.entity';
import { TiendaDTO } from './tienda.dto';
import { ValidationError } from 'class-validator';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

@Controller('tienda')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaController {
  constructor(private readonly tiendaService: TiendaService) {}

  @Get()
  async findAll() {
    return await this.tiendaService.findAll();
  }

  @Get(':tiendaId')
  async findOne(@Param('tiendaId') tiendaId: string) {
    return await this.tiendaService.findOne(tiendaId);
  }

  private validateCiudadFormat(ciudad: string): void {
    const ciudadRegex = /^[A-Z]{3}$/;
    if (!ciudadRegex.test(ciudad)) {
      throw new BusinessLogicException(
        'Invalid city code format. Must be three uppercase letters.',
        BusinessError.BAD_REQUEST,
      );
    }
  }

  @Post()
  async create(@Body() tiendaDto: TiendaDTO) {
    this.validateCiudadFormat(tiendaDto.ciudad);
    try {
      const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
      return await this.tiendaService.create(tienda);
    } catch (error) {
      console.error(error);
      if (error instanceof ValidationError) {
        console.error(error);
        throw new BadRequestException('Error de validación en el DTO');
      }
      if (error instanceof BusinessLogicException) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Invalid city code format. Must be three uppercase letters.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @Put(':tiendaId')
  async update(
    @Param('tiendaId') tiendaId: string,
    @Body() tiendaDto: TiendaDTO,
  ) {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
    this.validateCiudadFormat(tiendaDto.ciudad);
    return await this.tiendaService.update(tiendaId, tienda);
  }

  @Delete(':tiendaId')
  @HttpCode(200)
  async delete(@Param('tiendaId') tiendaId: string) {
    await this.tiendaService.delete(tiendaId);
    return { message: 'Store deleted successfully' };
  }
}
