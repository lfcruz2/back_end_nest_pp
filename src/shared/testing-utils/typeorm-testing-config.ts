import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoTiendaEntity } from 'src/producto-tienda/producto-tienda.entity';
import { ProductoEntity } from 'src/producto/producto.entity';
import { TiendaEntity } from 'src/tienda/tienda.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ProductoEntity, ProductoTiendaEntity, TiendaEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    ProductoEntity,
    ProductoTiendaEntity,
    TiendaEntity,
  ]),
];
