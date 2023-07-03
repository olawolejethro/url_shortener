import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import {
  redirectUrl,
  generateQrCode,
  shortenUrl,
  costumUrl,
} from "../controller/urlController.js";
dotenv.config();
const router = express.Router();
// short url generator

router.post("/short", shortenUrl);
router.post("/costumeUrl", passport.authenticate("local"), costumUrl);
router.get("/:urlId", passport.authenticate("local"), redirectUrl);
router.post("/qrCode", passport.authenticate("local"), generateQrCode);

export default router;
