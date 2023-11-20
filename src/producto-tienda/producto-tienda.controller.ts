import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoTiendaService } from './producto-tienda.service';
import { TiendaEntity } from 'src/tienda/tienda.entity';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
  private readonly logger = new Logger(ProductoTiendaController.name);
  constructor(private readonly productoTiendaService: ProductoTiendaService) {}

  @Post(':productoid/tiendas/:tiendaid')
  async addTiendaToProducto(
    @Param('tiendaid') tiendaid: string,
    @Param('productoid') productoid: string,
  ) {
    this.logger.debug('addTiendaToProducto');
    return await this.productoTiendaService.addTiendaToProducto(
      tiendaid,
      productoid,
    );
  }

  @Get(':productoid/tiendas')
  async findTiendasFromProducto(@Param('productoid') productoid: string) {
    this.logger.debug('findTiendasFromProducto');
    return await this.productoTiendaService.findTiendasFromProducto(productoid);
  }

  @Get(':productoid/tiendas/:tiendaid')
  async findTiendaFromProducto(
    @Param('productoid') productoid: string,
    @Param('tiendaid') tiendaid: string,
  ) {
    this.logger.debug('findTiendaFromProducto');
    return await this.productoTiendaService.findTiendaFromProducto(
      productoid,
      tiendaid,
    );
  }

  @Put(':productoid/tiendas')
  async updateTiendasFromProducto(
    @Param('productoid') productoid: string,
    @Body() tiendas: TiendaEntity[],
  ) {
    this.logger.debug('updateTiendasFromProducto');
    return await this.productoTiendaService.updateTiendasFromProducto(
      productoid,
      tiendas,
    );
  }

  @Delete(':productoid/tiendas/:tiendaid')
  @HttpCode(204)
  async deleteTiendaFromProducto(
    @Param('productoid') productoid: string,
    @Param('tiendaid') tiendaid: string,
  ) {
    this.logger.debug('deleteTiendaFromProducto');
    return await this.productoTiendaService.deleteTiendaFromProducto(
      productoid,
      tiendaid,
    );
  }
}
