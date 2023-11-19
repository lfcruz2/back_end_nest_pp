import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaModule } from './tienda/tienda.module';
import { TiendaEntity } from './tienda/tienda.entity';
import { ProductoModule } from './producto/producto.module';
import { ProductoEntity } from './producto/producto.entity';
import { ProductoTiendaModule } from './producto-tienda/producto-tienda.module';
import { ProductoTiendaEntity } from './producto-tienda/producto-tienda.entity';

@Module({
  imports: [
    ProductoModule,
    TiendaModule,
    ProductoTiendaModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'src/db/db.sqlite',
      entities: [ProductoEntity, ProductoTiendaEntity, TiendaEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
