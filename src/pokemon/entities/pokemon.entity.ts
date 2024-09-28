import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

//entidades esta relaciona con las tablas de las base de datos
@Schema()
export class Pokemon extends Document{
  //extends Document da las propiedades de la BD de mongoose
    //id: string -> mongo la me lo da
    @Prop({unique: true, index: true})
    name: string;
    
    @Prop({unique: true, index: true})
    no:number
}

//exportamos el eschema para que cuando se inicie la base de datos le indique las deficiniciones y reglas que debe usar la BD

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);