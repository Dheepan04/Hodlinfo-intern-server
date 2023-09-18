import express from "express";
import axios from "axios";
import cors from "cors";
import mongoose from "mongoose";
import { HOD } from "./hod_model.js";

const app = express();

const corsOptions = {
  origin: 'https://hodlinfo-dheepan.netlify.app/',
};

app.use(cors(corsOptions));


const connect = async (
  url = "mongodb+srv://Dheepan:dheepancocgta1@cluster0.v9qqcug.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
) => {
  try {
    return await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
};

app.get("/", async (req, res, next) => {
  try {
    const resp = await axios.get("https://api.wazirx.com/api/v2/tickers");
    console.log(typeof resp.data);
    const response = [];

    const iterate = (data) => {
      Object.keys(data).forEach(async (key) => {
        if (typeof data[key] === 'object') {
          iterate(data[key]);
          if (response.length < 10) {
            response.push({ key: key, value: data[key] });
          }
        }
      });
    };

    iterate(resp.data);

    for (let i = 0; i < response.length; i++) {
      await HOD.findOneAndUpdate(
        { name: response[i].value.name },
        response[i].value,
        { upsert: true } // Add this option to create the document if it doesn't exist
      );
    }

    const saved = await HOD.find().sort({ x: -1 }).limit(10);
    console.log(response);
    res.json({ status: "Server is running", data: saved });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3001, async () => {
  try {
    await connect();
    console.log("Port is on 3001");
  } catch (error) {
    console.error("Server startup error:", error);
  }
});
