const { MongoClient } = require('mongodb');

// MongoDB connection URI from .env.local
const MONGODB_URI = "mongodb+srv://mukesh:Mukesh123@cluster0.xwl1pv6.mongodb.net/?appName=Cluster0";
const DB_NAME = "test"; // Your database name

async function migrateCamps() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("✓ Connected successfully");
    
    const db = client.db(DB_NAME);
    const sourceCollection = db.collection('campdetails');
    const targetCollection = db.collection('bloodcamps');
    
    // Get all documents from campdetails
    const camps = await sourceCollection.find({}).toArray();
    console.log(`\nFound ${camps.length} camp(s) in 'campdetails' collection`);
    
    if (camps.length === 0) {
      console.log("No camps to migrate.");
      return;
    }
    
    // Insert into bloodcamps
    console.log("\nMigrating camps to 'bloodcamps' collection...");
    const result = await targetCollection.insertMany(camps);
    console.log(`✓ Successfully migrated ${result.insertedCount} camp(s)`);
    
    // Optional: Delete from old collection
    console.log("\nDeleting camps from old 'campdetails' collection...");
    const deleteResult = await sourceCollection.deleteMany({});
    console.log(`✓ Deleted ${deleteResult.deletedCount} camp(s) from 'campdetails'`);
    
    console.log("\n✅ Migration completed successfully!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await client.close();
    console.log("\n✓ Connection closed");
  }
}

migrateCamps();
