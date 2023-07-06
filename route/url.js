const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const {
  redirectUrl,
  generateQrCode,
  shortenUrl,
  costumUrl,
} = require("../controller/urlController.js");
dotenv.config();
const router = express.Router();
// short url generator

router.post("/short", shortenUrl);
router.post("/costumeUrl", costumUrl);
router.get("/:urlId", redirectUrl);
router.post("/qrCode", generateQrCode);

module.exports = router;
