import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';

@Entity()
export class ProductoTiendaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cantidad: number;

  @ManyToOne(() => ProductoEntity, (producto) => producto.productosTiendas)
  producto: ProductoEntity;

  @ManyToOne(() => TiendaEntity, (tienda) => tienda.productosTiendas)
  tienda: TiendaEntity;
}
