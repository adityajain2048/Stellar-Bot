import mongoose from "mongoose";
import { config } from "../config";

mongoose.connect(config.MONGO_URL, {
  serverApi: {
    version: "1", // Use '1' for ServerApiVersion.v1
  },
});

// Get the default connection
const db = mongoose.connection;

// Event listener for successful connection
//   db.on('connected', () => {
//     console.log('Mongoose connected to MongoDB Atlas');
//   });

export default db;
