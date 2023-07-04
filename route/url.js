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
router.post("/costumeUrl", costumUrl);
router.get("/:urlId", redirectUrl);
router.post("/qrCode", generateQrCode);

export default router;
