import express from "express";
import userUrl from "../model/userUrl.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/costumeUrl", async (req, res) => {
  const baseUrl = process.env.BASE_URL;
  try {
    const { urlId, origUrl } = req.body;

    let url = await userUrl.findOne({ urlId });
    console.log(url);
    if (url) {
      return res.send("url already exist");
    } else {
      const costumUrl = `${baseUrl}/${urlId}`;
      const urls = await userUrl.create({ origUrl, costumUrl, urlId });

      //   console.log(urls);
      (await urls).save();
      return res.status(201).send(urls);
    }
  } catch (err) {
    console.log(err);
    new Error("unable to create constum url");
  }
});

export default router;
