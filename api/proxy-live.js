export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

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
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}
