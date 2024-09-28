import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { json } from 'stream/consumers';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name=createPokemonDto.name.toLowerCase();
    //Manejar la exepción de validación de registro unico: cuando se trata de ingresar un registro ya ingresado
    try{
       //como creamos algo facilmente utilizando nuestro modelo
        const pokemon = await this.pokemonModel.create(createPokemonDto);
        return pokemon;
    }catch(error){
      this.handleExeptions(error);
    }
  }

  async findAll() {
    const list= await this.pokemonModel.find({});
    return list;
  }

  async findOne(term: string) {
    let pokemon:Pokemon;
    //Identificación por id
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no:term});
    }
    //identificación por Mongo id
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }
    //identificación por name
    if(!pokemon){
      //trim: para eliminar los espacios en blanco si los mando asi
      pokemon = await this.pokemonModel.findOne({name:term.toLowerCase().trim()});
    }
    //en el casi que el pokemon no existe
    if (!pokemon) throw new NotFoundException(`Pokemon whith id, name or no "${term}" not found`); 

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon= await this.findOne(term);
    //update: para actualizar los valores de un documento
    if (updatePokemonDto.name){
      updatePokemonDto.name=updatePokemonDto.name.toLowerCase();
    }
   
   try{
     await pokemon.updateOne(updatePokemonDto);
     return await this.findOne(term);
    }catch(error){
      this.handleExeptions(error);
    }
  }

  // //delete sin controlar el MongoID
  // async remove(term: string) {
  //   const pokemon= await this.findOne(term);
  //   await pokemon.deleteOne();
  //   return `The pokemon with id, name or no #${term} deleted successfully`;
  // 
  
  async remove(id: string) {
    // await this.pokemonModel.findOneAndDelete({_id:id});
    // return `The pokemon with id ${id} deleted successfully`;
    //const result= await this.pokemonModel.findOneAndDelete({_id:id});
    const {deletedCount} = await this.pokemonModel.deleteOne({_id:id});
    if(deletedCount===0){
      throw new BadRequestException(`The pokemon with id ${id} not found`)
    }
    return;
  }

  private handleExeptions(error:any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon ${JSON.stringify(error.keyValue)} exists in DB`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't update Pokemon - Check server log`);
  }
}
