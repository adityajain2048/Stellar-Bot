import mongoose from "mongoose";
import { envConfigs } from "../helpers/common/envConfigs";

const connectDb = async () => {
  await mongoose
    .connect(envConfigs.dbUrl)
    .then(() => {
      console.log("Db connected successfully.");
    })
    .catch((err) => {
      console.log(`Error while connecting to db: ${err}`);
      throw new Error(`Error while connecting to db: ${err}`);
    });
};

export default connectDb;
