const express = require("express");
const { connection } = require("./db");
const { bankRouter } = require("./routes/bank");
const app = express();
app.use(express.json());
app.use("/bank", bankRouter);

app.listen("4500", async () => {
  try {
    await connection;
    console.log("Db is connected!");
  } catch (error) {
    console.log({ error: error });
  }
  console.log("Server is connected!");
});
