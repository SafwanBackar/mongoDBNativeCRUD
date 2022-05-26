const { MongoClient } = require('mongodb');
require('dotenv').config()

async function main() {
    const url = process.env.URL;
    const client = new MongoClient(url);

   
    try {
        await client.connect();
        // DELETE ONE
        // Check if a listing named "Cozy Cottage" exists. Run update.js if you do not have this listing.
        await printIfListingExists(client, "Cozy Cottage");
        // Delete the "Cozy Cottage" listing
        await deleteListingByName(client, "Cozy Cottage");
        // Check that the listing named "Cozy Cottage" no longer exists
        await printIfListingExists(client, "Cozy Cottage");

        // DELETE MANY
        // Check if the listing named "Ribeira Charming Duplex" (last scraped February 16, 2019) exists
        await printIfListingExists(client, "Ribeira Charming Duplex");
        // Check if the listing named "Horto flat with small garden" (last scraped February 11, 2019) exists
        await printIfListingExists(client, "Horto flat with small garden");
        // Delete the listings that were scraped before February 15, 2019
        await deleteListingsScrapedBeforeDate(client, new Date("2019-02-15"));
        // Check that the listing named "Ribeira Charming Duplex" still exists
        await printIfListingExists(client, "Ribeira Charming Duplex");
        // Check that the listing named "Horto flat with small garden" no longer exists
        await printIfListingExists(client, "Horto flat with small garden");

    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function deleteListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteOne({ name: nameOfListing });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

async function deleteListingsScrapedBeforeDate(client, date) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteMany({ "last_scraped": { $lt: date } });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

async function printIfListingExists(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ name: nameOfListing });
    if (result) {
        if (result.last_scraped) {
            console.log(`Found a listing in the collection with the name '${nameOfListing}'. Listing was last scraped ${result.last_scraped}.`);
        } else {
            console.log(`Found a listing in the collection with the name '${nameOfListing}'`);
        }
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

console.log("Already deleted files, then run update")