import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/proxy-live", async (req, res) => {
  try {
    const url =
      "https://api.t3cdn.com/511/api/live-service/h5/v5/public/live/lives?pageNum=1&pageSize=50&labelId=1";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic d2ViLXBsYXllcjp3ZWJQbGF5ZXIyMDIyKjk2My4hQCM=`,
        "x-frame-options": "DENY",
        "x-content-type-option": "nosniff",
        "locale-language": "VIT",
        merchantid: "511",
        "dev-type": "H5",
        area: "VN",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNum: 1,
        pageSize: 50,
        labelId: 1,
      }),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
