const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userUrl = require("../model/userUrl.js");
const util = require("util");
const validateHttpUrl = require("../utils/utils.js");
const qr = require("qrcode");
const dotenv = require("dotenv");
const auth = require("../model/authModel.js");
dotenv.config();

exports.redirectUrl = async (req, res, next) => {
  try {
    let url = await userUrl.findOne({ urlId: req.params.urlId });
    console.log(url);
    if (url) {
      await userUrl.updateOne(
        { urlId: req.params.urlId },
        { $inc: { clicks: 1 } }
      );

      return res.status(302).redirect(url.origUrl);
    } else {
      res.status(404).send("Url not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("input a valid url");
  }
};

let history = [];

exports.shortenUrl = async (req, res, next) => {
  const origUrl = req.body.originalUrl;
  const token = req.cookies.token;
  // Verify token
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  // console.log(decoded);
  const user_id = decoded.user._id;
  console.log(user_id);
  const loggedInUser = await auth.findById(user_id);
  console.log(loggedInUser);

  if (!loggedInUser) {
    // User is not logged in
    return res.send("Please log in to shorten the URL");
  }
  if (validateHttpUrl(origUrl)) {
    let hash;

    const hashInput =
      decoded.user && decoded.user.email
        ? decoded.user.email + origUrl
        : origUrl;
    hash = crypto.createHash("md5").update(hashInput).digest("hex");
    const urlId = hash.slice(0, 7);

    console.log("mine", hash, urlId);
    try {
      let url = await userUrl.findOne({ origUrl });
      if (url) {
        return res.send("url already exist");
      } else {
        const shortUrl = `${req.protocol}://${req.get("host")}/s/${urlId}`;
        let urls = await userUrl.create({
          urlId,
          origUrl,
          user_id,
          shortUrl,
          date: Date.now,
        });
        // console.log("hi", urls);
        let urlHistory = await userUrl.find({ user_id });
        // console.log(urlHistory, "😘");
        const urlData = Object.entries(urls)[1];

        (await urls).save();
        return res.render("url", { urlData, urlHistory });
        // return res.status(201).send(urls);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("server error");
    }
  } else {
    res.status(400).json("invalid url");
  }
};

exports.costumUrl = async (req, res, next) => {
  // const baseUrl = process.env.BASE_URL;
  const { urlId, origUrl } = req.body;

  const token = req.cookies.token;
  // Verify token
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user_id = decoded.user._id; // decode user jwt save as cookies
  const loggedInUser = await auth.findById(user_id);

  if (!loggedInUser) {
    // User is not logged in
    return res.send("Please log in to shorten the URL");
  }
  if (validateHttpUrl(origUrl)) {
    try {
      let url = await userUrl.findOne({ urlId });
      if (url) {
        return res.send("url already exist");
      } else {
        const costumUrl = `${req.protocol}://${req.get("host")}/s/${urlId}`;

        const urls = await userUrl.create({
          origUrl,
          costumUrl,
          user_id,
          urlId,
        });
        let urlHistory = await userUrl.find({ user_id });

        (await urls).save();
        const urlData = Object.entries(urls)[1];
        return res.render("url", { urlData, urlHistory });
      }
    } catch (err) {
      console.log(err);
      new Error("unable to create constum url");
    }
  } else {
    res.status(400).json("invalid url");
  }
};

exports.generateQrCode = async (req, res, next) => {
  const shortUrl = req.body.shortUrl;
  console.log(shortUrl);
  const qrCodeData = await qr.toDataURL(shortUrl, (err, src) => {
    res.render("image", { qrCode: src });
  });
};
