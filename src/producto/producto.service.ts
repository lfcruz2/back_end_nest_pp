import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({
      relations: ['productosTiendas'],
    });
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['productosTiendas'],
    });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    this.validateTipoProducto(producto.categoria);
    return await this.productoRepository.save(producto);
  }

  async update(
    id: string,
    productoData: ProductoEntity,
  ): Promise<ProductoEntity> {
    const persistedProducto: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id },
      });
    if (!persistedProducto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    this.validateTipoProducto(productoData.categoria);

    return await this.productoRepository.save({
      ...persistedProducto,
      ...productoData,
    });
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

  async delete(id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    try {
      await this.productoRepository.remove(producto);
    } catch (error) {
      throw new BusinessLogicException(
        'Failed to delete the product. Please try again.',
        BusinessError.FAILED_DELETE,
      );
    }
  }
}
