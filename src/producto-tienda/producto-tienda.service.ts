import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';
import { ProductoEntity } from 'src/producto/producto.entity';
import { TiendaEntity } from 'src/tienda/tienda.entity';

@Injectable()
export class ProductoTiendaService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}

  async addTiendaToProducto(
    tiendaid: string,
    productoid: string,
  ): Promise<ProductoEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaid },
    });
    if (!tienda) {
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoid },
      relations: ['tiendas'],
    });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    producto.tiendas = [...producto.tiendas, tienda];
    console.debug(producto);
    return await this.productoRepository.save(producto);
  }

  async findTiendasFromProducto(productoid: string): Promise<TiendaEntity[]> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoid },
      relations: ['tiendas'],
    });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return producto.tiendas;
  }

  async findTiendaFromProducto(
    productoid: string,
    tiendaid: string,
  ): Promise<TiendaEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoid },
      relations: ['tiendas'],
    });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const tienda: TiendaEntity = producto.tiendas.find(
      (e) => e.id === tiendaid,
    );
    if (!tienda) {
      throw new BusinessLogicException(
        'The store with the given id is not associated to the product',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return tienda;
  }

  async updateTiendasFromProducto(
    productoid: string,
    tiendas: TiendaEntity[],
  ): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoid },
      relations: ['tiendas'],
    });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    for (let i = 0; i < tiendas.length; i++) {
      const tienda: TiendaEntity = await this.tiendaRepository.findOne({
        where: { id: tiendas[i].id },
      });
      if (!tienda) {
        throw new BusinessLogicException(
          'The store with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      }
    }
    producto.tiendas = tiendas;
    return await this.productoRepository.save(producto);
  }

  async deleteTiendaFromProducto(
    productoid: string,
    tiendaid: string,
  ): Promise<void> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaid },
    });
    if (!tienda) {
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoid },
      relations: ['tiendas'],
    });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const productoTienda: TiendaEntity = producto.tiendas.find(
      (e) => e.id === tiendaid,
    );
    if (!productoTienda) {
      throw new BusinessLogicException(
        'The store with the given id is not associated to the product',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    producto.tiendas = producto.tiendas.filter((e) => e.id !== tiendaid);
    await this.productoRepository.save(producto);
  }
}
