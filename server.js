const express = require("express"),
  app = express(),
  port = process.env.PORT || 9998;
var http = require("http");
var moment = require("moment");
const nodemailer = require("nodemailer");

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bch-fr.firebaseio.com/",
  storageBucket: "bch-fr.appspot.com",
});
var bucket = admin.storage().bucket();
app.use(require("./routes/v1.js"));

// Retrieve new posts as they are added to the database
console.log(moment().utcOffset(8).format("YYYY/MM/DD HH:mm:ss"));
admin
  .database()
  .ref("reports")
  .orderByChild("dateTime")
  .startAt(moment().utcOffset(8).format("YYYY/MM/DD HH:mm:ss"))
  .on("child_added", async function (snapshot) {
    console.log(snapshot.val());
    let imgURL = "";
    if (!snapshot.val().imageurl) {
      imgURL = "No IMAGE";
    } else {
      await bucket
        .file(snapshot.val().imageurl)
        .getMetadata()
        .then((results) => {
          imgURL = `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
          }/o/${encodeURIComponent(snapshot.val().imageurl)}?alt=media&token=${
            results[0].metadata.firebaseStorageDownloadTokens
          }`;
        })
        .catch((err) => {
          console.log("some error: " + err);
        });
    }
    console.log(imgURL);

    function getIssueAndLocAlpha() {
      //ok im gonna try to store the objects in an array then extract/filter them into a array?
      let testString = "";
      if (!(snapshot.val().problem.checkbox.name == undefined)) {
        testString =
          snapshot.val().problem.checkbox.name +
          "  regarding  " +
          snapshot.val().problem.checkbox.answer;
        console.log("Defined " + testString);
      } else {
        for (i = 0; i < snapshot.val().problem.checkbox.length; i++) {
          testString +=
            snapshot.val().problem.checkbox[i].name +
            " :   " +
            snapshot.val().problem.checkbox[i].answer[0];
          if (i < snapshot.val().problem.checkbox.length) {
            testString += ", ";
          }
        } //end of for loop
        console.log("Undefined " + testString);
      } //else closes
      return testString;
    } //end of getIssueAndLocAlpha()

    let transporter = nodemailer.createTransport(
      {
        host: "",
        port: ,
        secure: , // true for 465, false for other ports
        auth: {
          user: "", // user
          pass: "", // password
        },
      },
      {
        // default message fields
        // sender info
        from: "BCHApp <bchapp@bch.com.sg>",
        // list of receivers
        to: snapshot.val().email,
      }
    );

    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.error(error);
      } else {
        console.log("Verified.");
      }
    });

    /***************************************************************
     *                          Send Mail                          *
     * *************************************************************
     * - Responsible for sending the actual email out
     * # However is disabled due to how time is filtered
     * # To fix pls format time in db to proper raw datetime format
     ***************************************************************/

    //this method will get issue and issue location for the email to display
    transporter.sendMail(
      {
        subject: `${snapshot.val().problem.category} fault at ${
          snapshot.val().storeName
        }`, // Subject line
        html: `<br>Hi,<br><br><br>A fault regarding
        <b>${
          snapshot.val().problem.category
        }</b>, with <b>${getIssueAndLocAlpha()}</b><br>
        Fault occurred at          : <b>${snapshot.val().storeName}</b><br>
        Fault has been reported by : <b>${snapshot.val().staffName}</b><br>
        incident happened at       : <b>${snapshot.val().dateTime} </b>
        <img src=${imgURL} width="300px" height="450px" alt="Staff did not upload image">
        .<br><br><br></br><br>Cheers!</br><br>Friendly email robot</br>
        `, // html body
      },
      function (error, info) {
        if (error) {
          console.log(
            "error is " + error + " email string is > " + snapshot.val().email
          );
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );
  });

var httpServer = http.createServer(app);
httpServer.listen(port, () => console.log(`Hard on port ${port}`));
