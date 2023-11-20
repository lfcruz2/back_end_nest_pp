import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}

  async findAll(): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.find({
      relations: ['productosTiendas'],
    });
  }

  async findOne(id: string): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
      relations: ['productosTiendas'],
    });
    if (!tienda) {
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return tienda;
  }

  async create(tienda: TiendaEntity): Promise<TiendaEntity> {
    this.validateCiudadFormat(tienda.ciudad);
    return await this.tiendaRepository.save(tienda);
  }

  async update(id: string, tiendaData: TiendaEntity): Promise<TiendaEntity> {
    const persistedTienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!persistedTienda) {
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    this.validateCiudadFormat(tiendaData.ciudad);

    return await this.tiendaRepository.save({
      ...persistedTienda,
      ...tiendaData,
    });
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

  async delete(id: string) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!tienda) {
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    try {
      await this.tiendaRepository.remove(tienda);
    } catch (error) {
      throw new BusinessLogicException(
        'Failed to delete the store. Please try again.',
        BusinessError.FAILED_DELETE,
      );
    }
  }
}
