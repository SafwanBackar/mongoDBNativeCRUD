const { MongoClient } = require('mongodb');
require('dotenv').config()

async function main() {
    const url = process.env.URL;
    const client = new MongoClient(url);

    try {
        await client.connect();
        // await listDatabases(client)

        // ==========================
        //          CREATE
        // ==========================
        // Creating database list 
        // await createListing(client,
        //     {
        //         name: "lovely loft",
        //         summary: 'A charming loft in Paris',
        //         bedrooms: 1,
        //         bathrooms: 1
        //     })


        // Creating with insertMany 
        await createMultipleListing(client, [
            {
                name: "Infinite Views",
                summary: "Modern home with infinite views from the infinity pool",
                property_type: "House",
                bedrooms: 5,
                bathrooms: 4.5,
                beds: 5
            },
            {
                name: "Private room in London",
                property_type: "Apartment",
                bedrooms: 1,
                bathroom: 1
            },
            {
                name: "Beautiful Beach House",
                summary: "Enjoy relaxed beach living in this house with a private beach",
                bedrooms: 4,
                bathrooms: 2.5,
                beds: 7,
                last_review: new Date()
            }
        ])

    }catch(e){
        console.error(e);
    } 
    finally {
        await client.close();
    }
}

main().catch(console.error);


async function createMultipleListing(client, newListings){
   const result = await client.db("sample_airbnb").collection("listingAndReviews")
   .insertMany(newListings) 

   console.log(`${result.insertCount} new listings created with the following id(s):`);
   console.log(result.insertedIds);
}



async function createListing(client, newListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}


async function listDatabases(client){
    const databaseList = await client.db().admin().listDatabases();
    console.log('Databases :');
    databaseList.databases.forEach(element => {
        console.log(`-${element.name}`);
    });
}




 

