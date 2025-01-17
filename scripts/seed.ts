const {PrismaClient} = require("@prisma/client")
require('dotenv').config();

const  database= new PrismaClient();


async function main() {
    try{
        await database.$connect();
        console.log("Connected to the database");
        await database.category.createMany({
            data: [
             {name:"Computer Science"} ,
             {name:"Music"},
             {name:"Art"},
             {name:"Fitness"},
             {name:"Photography"},
             {name:"Chemistry"},
             {name:"Accounting"},
             {name:"Economics"},
             {name:"Filming"},
            ]
        })
        console.log("Categories created");
    }
    catch(error){
        console.error("the error during creating category is ",error);

    }
    finally{
        await database.$disconnect();
    }
}
main();