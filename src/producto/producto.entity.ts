import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductoTiendaEntity } from '../producto-tienda/producto-tienda.entity';

@Entity()
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({ type: 'enum', enum: ['Perecedero', 'No perecedero'] })
  categoria: string;

  @Column()
  precio: number;

  @OneToMany(
    () => ProductoTiendaEntity,
    (productoTienda) => productoTienda.producto,
  )
  productosTiendas: ProductoTiendaEntity[];
}
