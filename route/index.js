import express from "express";
import userUrl from "../model/userUrl.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/:urlId", async (req, res) => {
  try {
    // const { urlId, costumUrl } = req.params;
    let url = await userUrl.findOne({ urlId: req.params.urlId });
    // let url = await userUrl.find({ urlId, costumUrl });
    console.log(url);
    if (url) {
      await userUrl.updateOne(
        { urlId: req.params.urlId },
        { $inc: { clicks: 1 } }
      );

      return res.status(302).redirect(url.origUrl);
    } else {
      res.status(404).send("shortUrl not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("input a valid url");
  }
});

export default router;
