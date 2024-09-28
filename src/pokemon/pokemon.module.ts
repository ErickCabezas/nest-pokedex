import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  //importamos los schema de la base de datos que vamos a utilizar, para qyue haga referecia con 
  //el schema que hemos creado 
  imports: [
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema, // nombre de la colección en la BD
      },
    ])
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
