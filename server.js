import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, "data.json");

async function readData() {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeData(data) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

app.post("/data.json", async (req, res) => {
  try {
    const newData = req.body;
    const existingData = await readData();
    existingData.push(newData);
    await writeData(existingData);
    res.json({ message: "Data added successfully", data: newData });
  } catch (error) {
    console.error("Error writing data:", error);
    res.status(500).json({ message: "Error writing data" });
  }
});

app.get("/data.json", async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    console.error("Error reading data:", error);
    res.status(500).json({ message: "Error reading data" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
