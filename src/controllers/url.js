const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const { url, alias } = req.body;

  if (!url && !alias) {
    return res.status(400).json({ error: "URL is required" });
  }

  if (url && alias) {
    let existingAliasURL = await URL.findOne({ alias });
    if (!existingAliasURL) {
      await URL.create({
        shortId: shortid(),
        alias,
        redirectURL: url,
      });
      return res.json({ shortUrl: `/${alias}` });
    } else {
      return res.status(400).json({ error: "Alias already in use" });
    }
  }

  if (!url && alias) {
    return res.status(400).json({ error: "URL is required" });
  }

  if (url && !alias) {
    let existingURL = await URL.findOne({ redirectURL: url });
    if (existingURL) {
      if (!existingURL.alias) {
        return res.json({ shortUrl: `/${existingURL.shortId}` });
      } else {
        const existingUnaliasedURL = await URL.findOne({ redirectURL: url, alias: { $exists: false } });
        if (existingUnaliasedURL) {
          return res.json({ shortUrl: `/${existingUnaliasedURL.shortId}` });
        } else {
          const shortId = shortid();
          await URL.create({
            shortId,
            redirectURL: url,
          });
          return res.json({ shortUrl: `/${shortId}` });
        }
      }
    } else {
      const shortId = shortid();
      await URL.create({
        shortId,
        redirectURL: url,
      });
      return res.json({ shortUrl: `/${shortId}` });
    }
  }
}

module.exports = {
  handleGenerateNewShortURL,
};
