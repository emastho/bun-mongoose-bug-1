import mongoose from "mongoose";
import { promises as fs } from "node:fs";

const handleConnection = () => {
  console.log("Connected to MongoDB");
  const db = mongoose.connection.useDb("testing");

  const okmodel = new mongoose.Schema({
    name: String,
    age: Number,
  });

  const human = db.model("Humans", okmodel);
  const create = human
    .create({
      name: "John",
      age: 54,
    })
    .then(async (res) => {
      // Bun.write("output.txt", JSON.stringify(res));
      await fs.writeFile("output.txt", JSON.stringify(res));
      return console.log(res);
    })
    .catch(console.error);
};

const conn = mongoose
  .connect("mongodb://root:pass@127.0.0.1:27017")
  .then(handleConnection)
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
