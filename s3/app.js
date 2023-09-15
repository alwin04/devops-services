//provides stronger error checking and more secure code
"use strict";

// web server framework for Node.js applications
const express = require("express");
const axios = require('axios');
// allows requests from web pages hosted on other domains
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fileName = "app.js";

const { HttpException } = require("./HttpException.utils");

const app = express();
const port = 8083;

// Parses incoming JSON requests
app.use(express.json());
app.use(cors());

/** add reqId to api call */
app.use(function (req, res, next) {
  res.locals.reqId = uuidv4();
  next();
});

app.post("/add-sub", (req, res) => {
  const {a=0, b=0} = req.body;
  console.log(`A: ${a}, B: ${b}`);

    // Call service S1 to get the sum
    const sumResponse = await axios.get('http://s1:3001/sum', { params: { a, b } });

    // Call service S2 to get the difference
    const diffResponse = await axios.get('http://s2:3002/difference', { params: { a, b } });

    const sum = sumResponse.data;
    const difference = diffResponse.data;

    res.json({ sum, difference });
  
});

/** 404 error */
app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  return res.status(err.status).send(err.message);
});

app.listen(port, () => {
  console.log("Start", fileName, `S3 App listening at http://localhost:${port}`);
});
