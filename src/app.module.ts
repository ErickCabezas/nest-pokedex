import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    //Para ejecutar el contenido statico
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),
    //para la conección a la base de datos de mongo
    //El forRoot tenemos que especificarle como minimo argumoneto cual es el URL de la BD
    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),
    PokemonModule,
    CommonModule
  ],
  
})
export class AppModule {}
