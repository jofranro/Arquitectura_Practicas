import { MongoClient, Database } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { SlotSchema } from "./schemas.ts"; 
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

//Escribo aqui el MONGO_USR Y MONGO_PWD pq el env no me funciona, lo intente arreglar durante la semana pero no di con la tecla 
const env = config();
/*  
if (!env.MONGO_USR || !env.MONGO_PWD){
    throw Error("You need env vars MONGO_USR and MONGO_PWD");
}
*/
export const mongo_usr = "jofranro";
export const mongo_pwd = "jofranro";

const connectMongoDB = async (): Promise<Database> => {

  const db_name = "citasmedicas";
  const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@cluster0.iczdkf2.mongodb.net/${db_name}?authMechanism=SCRAM-SHA-1`;

  const client = new MongoClient();
  await client.connect(mongo_url);
  const db = client.database(db_name);
  return db;
};

const db = await connectMongoDB();
console.info(`MongoDB ${db.name} connected`);

export const slotsCollection = db.collection<SlotSchema>("Characters");