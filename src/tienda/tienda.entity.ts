import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductoTiendaEntity } from '../producto-tienda/producto-tienda.entity';

@Entity({ name: 'tienda' })
export class TiendaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  ciudad: string;

  @Column()
  direccion: string;

  @OneToMany(
    () => ProductoTiendaEntity,
    (productoTienda) => productoTienda.tienda,
  )
  productosTiendas: ProductoTiendaEntity[];
}
