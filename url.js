const express = require("express");
const nanoId = require("nanoid");
const url = require("./model/userUrl");
const validateUrl = require("./utils/utils");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router;
