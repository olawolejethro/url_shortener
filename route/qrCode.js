import express from "express";
import userUrl from "../model/userUrl.js";
import dotenv from "dotenv";
import qr from "qrcode";
import fs from "fs";
dotenv.config();

const router = express.Router();

router.post("/qrCode", async (req, res) => {
  const { shortUrl, costumUrl } = req.body;
  const qrCodeData = await qr.toDataURL(shortUrl, costumUrl);
  const qrBufferCode = Buffer.from(qrCodeData.split(",")[1], "base64");
  fs.writeFileSync("qrcode.png", qrBufferCode);
  console.log(qrCodeData);
  console.log(qrBufferCode);

  return res.send(qrBufferCode);
});
export default router;
