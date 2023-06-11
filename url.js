import express from "express";
import { nanoid } from "nanoid";
import userUrl from "./model/userUrl.js";
// import validateUrl from "./utils/utils.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
// short url generator

router.post("/short", async (req, res) => {
  const { origUrl } = req.body;
  const baseUrl = process.env.BASE_URL;
  const urlId = nanoid(8);
  // console.log(urlId);
  // console.log(origUrl);
  if (origUrl) {
    try {
      let url = userUrl.find({ origUrl });
      console.log(url);
      if (url) {
        res.json.toString(url);
      } else {
        const shortUrl = `${baseUrl}${urlId}`;
        let url = userUrl.create({
          urlId,
          origUrl,
          shortUrl,
          clicks,
          date: Date.now,
        });
        // console.log(url);
        (await url).save();
        // await res.json.toString(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json("server error");
    }
  } else {
    res.status(400).json("invalid url");
  }
});

export default router;
