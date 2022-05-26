const { MongoClient } = require('mongodb');
require('dotenv').config()

async function main() {
    const url = process.env.URL;
    const client = new MongoClient(url);

   
    try {
        await client.connect();

        await findListingByName(client, "Infinite Views");

        await updateListingByName(client, "Infinite Views", { bedrooms: 6, beds: 8 });

        await updateAllListingsToHavePropertyType(client);

        await findListingByName(client, "Cozy Cottage");


    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function updateListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({ name: nameOfListing }, { $set: updatedListing });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

async function updateAllListingsToHavePropertyType(client) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateMany({ property_type: { $exists: false } }, { $set: { property_type: "Unknown" } });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

async function findListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing in the db with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

console.log("All queries have been updated");