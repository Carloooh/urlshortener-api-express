const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const cors = require("cors");

const app = express();
const PORT = 8001;

app.use(cors());
app.options('*', cors());

connectToMongoDB().then(() =>
  console.log("Mongodb connected")
);

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOne({
    $or: [{ shortId }, { alias: shortId }],
  });

  if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  await URL.findOneAndUpdate(
    { _id: entry._id },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));

module.exports = app;