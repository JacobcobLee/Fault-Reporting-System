const express = require("express");
const router = express.Router();
const { v5: uuidv5 } = require("uuid");
const admin = require("firebase-admin");
const cors = require("cors");
// const { body, validationResult, param, query } = require("express-validator");

router.use(express.json());

const db = admin.database();
const bucket = admin.storage().bucket();

router.use(cors());
const UUID_NAMESPACE = "a752002f-74ca-4249-aa3d-4e2eb99ac298";

//Middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Connected to API V1 Route");
  //console.log("Auth Headers: " + req.headers.authorization);
  next();
});

router.get("/api/v2/image",(req, res) => {
    let validate = 0;
    let i = 0;
    let doo = Object.values(req.body) // ['string,string']
    let test = doo[0].split(',') //['string','string']
    let objOfUrl=[];
       try{
         test.map( function url(item){
           bucket
          .file(item) 
          .getMetadata()
          .then((results) => {
            objOfUrl[i] = 
              `https://firebasestorage.googleapis.com/v0/b/${
                bucket.name
              }/o/${encodeURIComponent(item)}?alt=media&token=${
                results[0].metadata.firebaseStorageDownloadTokens
              }`
              console.log(objOfUrl[i])
              i++ // i ++ for objOfUrl
              console.log("i is :"+ i)
              validate++ //validate up to make the count ok
              console.log("validate is : "+validate)
              if(validate>=test){res.send(objOfUrl); console.log("if ran alr")}
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send(`Some error has occured. Error: ${err}`);
          });
        })//test.map
        console.log("SENDING BELOW")
        console.log(objOfUrl)
        res.status(200).send(objOfUrl)
      }catch(e){console.log("err in v1 get image func e is : "+e); res.status(500).send(":P error, liddat lor")}
  })

  module.exports = router;
