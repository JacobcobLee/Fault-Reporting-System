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

/************************************************************
 *                          FAULT                           *
 * **********************************************************
 * GET (retrieve all faults with/without filter parameters)
 *  => Filter based on status, Unresolved, Pening or Resolved
 *      =>  /api/v1/fault?status={insert status here}
 * GET/:UUID (retrieve single fault via fault's uuid)
 * PUT/:store/:id (update fault via key)
 * DELETE/:store/:id (delete fault via key)
 ************************************************************/

/**
 * Retrieve all faults with/without filter parameters
 */
router.get("/api/v1/fault", (req, res) => {
  const statusQuery = req.query.status;
  if (statusQuery == null) {
    // retrieve everything in reports reference
    db.ref("reports")
      .once("value")
      .then((snapshot) => {
        res.status(200).send(snapshot.val());
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send(`Internal server error! Error: ${error}`);
      });
  } else {
    // retrieve faults where status matches the status query (statusQuery)
    db.ref("reports")
      .orderByChild("status")
      .equalTo(statusQuery)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val() == null) {
          res.status(400).send("Data not found.");
        } else {
          res.status(200).send(snapshot.val());
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send(`Internal server error! Error: ${error}`);
      });
  }
});
/**
 * Retrieve a single fault via the fault's uuid
 */
router.get("/api/v1/fault/:UUID", (req, res) => {
  // #TODO add validation for UUID
  // Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"

  db.ref("reports")
    .child(req.params.UUID.toString())
    .once("value")
    .then((snapshot) => {
      if (snapshot.val() == null) {
        res.status(400).send("ID not found.");
      } else {
        res.send(snapshot.val());
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Internal server error! Error: ${error}`);
    });
});

/**
 * PUT/:UUID (update fault via fault's UUID)
 * Accepts JSON
 */
router.put("/api/v1/fault/:UUID", (req, res) => {
  db.ref("reports")
    .child(req.params.UUID)
    .update(req.body, function (error) {
      if (error) {
        console.error(error);
        res.status(400).send(error);
      } else {
        res.send("OK");
      }
    });
});
/**
 * DELETE/:id (delete fault via store and key)
 */
router.delete("/api/v1/fault/:key", (req, res) => {
  var dataRef = db.ref("reports");
  var childRef = dataRef.child(req.params.key);

  childRef.remove(function (error) {
    if (error) {
      console.error(error);
      res.status(400).send(error);
    } else {
      res.send("OK");
    }
  });
});

/************************************************************
 *                          TEST                            * //force upstream
 * *********************************************************/

router.get("/api/v1/fault2", (req, res) => {
  db.ref("reports")
    .orderByChild("date")
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Internal server error! Error: ${error}`);
    });
});

/**
 * Retrieve resolved cases lmiting to latest 10
 */
router.get("/api/v1/faultresolved10", (req, res) => {
  db.ref("reports")
    .orderByChild("status")
    .equalTo("Resolved")
    .limitToLast(10)
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Internal server error! Error: ${error}`);
    });
});

/**
 * Retrieve unresolved cases
 */
router.get("/api/v1/faultunresolved", (req, res) => {
  db.ref("reports")
    .orderByChild("status")
    .equalTo("Unresolved")
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Internal server error! Error: ${error}`);
    });
});

/**
 * Retrieve pending cases
 */
router.get("/api/v1/faultp", (req, res) => {
  db.ref("reports")
    .orderByChild("status")
    .equalTo("Pending")
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Internal server error! Error: ${error}`);
    });
});
/************************************************************
 *                          STORE                           *
 * **********************************************************
 * GET/allstorename (retrieve all store names only)
 * GET/store (retrieve all store infomation)
 * GET/:code (retrieve single store via store code)
 * POST (add store)
 * PUT/:code (update store info via code)
 * DELETE/:code (delete store via code)
 ************************************************************/

/**
 * Retrieve all store names only, used to be /api/v1/store
 */
router.get("/api/v1/allstorename", (req, res) => {
  db.ref("store")
    .once("value", function (snapshot) {
      var storeName = [];
      snapshot.forEach((store) => {
        storeName.push(store.val().name);
      });
      res.send(storeName);
    })
    .catch((err) => {
      res.status("500").send(`Something went wrong! Error: ${err}`);
    });
});
/**
 * Retrieve all store infomation, used to be /api/v1/store2
 */
router.get("/api/v1/allstore", (req, res) => {
  db.ref("store").once("value", function (snapshot) {
    res.send(Object.values(snapshot.val()));
  });
});
/**
 * Retrieve single store via code
 */
router.get("/api/v1/store/:code", (req, res) => {
  db.ref("store") 
    .orderByChild("code")
    .equalTo(req.params.code.toString())
    .once("value")
    .then((snapshot) => {
      if (snapshot.val() !== null) {
        res.send(snapshot.val());
      } else {
        res.status(400).send("Store code not found.");
      }
    })
    .catch((err) => {
      res.status(500).send(`Something went wrong! Error: ${err}`);
    });
});

/**
 * Add store
 */
router.post("/api/v1/store", (req, res) => {
  childStore = req.body.code.replace(/ /g, "_");

  dataTemplate = {
    name: req.body.name,
    code: req.body.code,
    address: req.body.address,
    qrstring: uuidv5(req.body.code, UUID_NAMESPACE),
  };

  db.ref("store")
    .child(childStore)
    .update(dataTemplate, function (err) {
      if (err) {
        return res.status(500).send(`An error has occured! Error: ${err}`);
      }
    }).catch((err)=>{console.log("err is  : " + err)});
  res.status(201).send("Success!");
});

router.put("/api/v1/store/:code", (req, res) => {
  /**
   * Update store infomation via store code
   */
  db.ref("store")
    .orderByChild("code")
    .equalTo(req.params.code.toString())
    .once("value", function (snapshot) {
      if (snapshot.val() == null) {
        return res.status(400).send("Store code not found.");
      }

      if (Object.keys(snapshot.val()).length == 1) {
        snapshot.forEach((child) => {
          if (child.name != req.body.name) {
            let temp = child.val();
            child.ref.remove();
            let childRef = db
              .ref("store")
              .child(req.body.name.replace(/ /g, "_"));
            childRef.set(temp);
            childRef.update(req.body);
          } else {
            child.ref.update(req.body);
          }
        });
        res.send("OK");
      } else {
        res.status(400).send("Store code not found.");
      }
    });
});

router.delete("/api/v1/store/:code", (req, res) => {
  /**
   * Delete store via store code */

  db.ref("store")
    .orderByChild("code")
    .equalTo(req.params.code.toString())
    .once("value", function (snapshot) {
      if (snapshot.val() == null) {
        return res.status(400).send("Store code not found.");
      }

      if (Object.keys(snapshot.val()).length == 1) {
        snapshot.forEach((child) => {
          child.ref.remove();
        });
        res.send("OK");
      } else {
        res.status(400).send("Store code not found.");
      }
    });
});

/*********************************************************************
 *                            CATEGORY                               *
 * *******************************************************************
 * GET/allcategoryname (Retrieve all category names only)
 * GET/category (Retrieve all category details)
 * GET/:categoryUUID (Retrieve single category via UUID)
 * POST (add category)
 * PUT/:categoryUUID (Update category infomation via category UUID)
 * DELETE/:categoryUUID (Delete category infomation via category UUID)
 *********************************************************************/

/**
 * Retrieve all category names only
 */
router.get("/api/v1/allcategoryname", (req, res) => {
  db.ref("problem")
    .once("value", function (snapshot) {
      var categoryName = [];
      snapshot.forEach((category) => {
        categoryName.push(category.val().name);
      });
      res.send(categoryName);
    })
    .catch((err) => {
      res.status("500").send(`Something went wrong! Error: ${err}`);
    });
});
/**
 * Retrieve all category details
 */
router.get("/api/v1/category", (req, res) => {
  db.ref("problem").once("value", function (snapshot) {
    res.send(Object.values(snapshot.val()));
  });
});
/**
 * Retrieve single category via UUID
 */
router.get("/api/v1/category/:categoryUUID", (req, res) => {
  db.ref("problem")
    .orderByChild("uuid")
    .equalTo(req.params.categoryUUID.toString())
    .once("value")
    .then((snapshot) => {
      if (snapshot.val() !== null) {
        res.send(snapshot.val());
      } else {
        res.status(400).send("Store code not found.");
      }
    })
    .catch((err) => {
      res.status(500).send(`Something went wrong! Error: ${err}`);
    });
});
/**
 * Add category
 */
router.post("/api/v1/category", (req, res) => {
  let reference = db.ref("problem");
  let pushReference = reference.push(req.body, function (error) {
    if (error) {
      console.error(error);
      res.status(500).send(`An error has occured! Error: ${err}`);
    }
  });

  reference
    .child(pushReference.key)
    .update({ uuid: pushReference.key }, function (error) {
      if (error) {
        console.error(error);
        res.status(500).send(`An error has occured! Error: ${err}`);
      } else {
        res.status(201).send(pushReference.key);
      }
    });
});
/**
 * Update category infomation via category UUID
 */
router.put("/api/v1/category/:categoryUUID", (req, res) => {
  db.ref("problem")
    .orderByChild("uuid")
    .equalTo(req.params.categoryUUID.toString())
    .once("value", function (snapshot) {
      if (snapshot.val() == null) {
        return res.status(400).send("Category UUID not found.");
      }

      if (Object.keys(snapshot.val()).length == 1) {
        snapshot.forEach((child) => {
          child.ref.update(req.body);
        });
        res.send("OK");
      } else {
        res.status(400).send("Category UUID not found.");
      }
    });
});
/**
 * Delete category infomation via category UUID
 */
router.delete("/api/v1/category/:categoryUUID", (req, res) => {
  db.ref("problem")
    .orderByChild("uuid")
    .equalTo(req.params.categoryUUID.toString())
    .once("value", function (snapshot) {
      if (snapshot.val() == null) {
        return res.status(400).send("Category UUID not found.");
      }

      if (Object.keys(snapshot.val()).length == 1) {
        snapshot.forEach((child) => {
          child.ref.remove();
        });
        res.send("OK");
      } else {
        res.status(400).send("Category UUID not found.");
      }
    });
});

/************************************************************
 *                        IMAGE                             *
 * **********************************************************
 * GET (Retrieve image via query)
 ************************************************************/
router.get("/api/v1/image", (req, res) => {
  if (req.query.location == null) {
    res.status(400).send(`Location query is null or empty!`);
  } else {
    bucket
      .file(req.query.location)
      .getMetadata()
      .then((results) => {
        res.send(
          `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
          }/o/${encodeURIComponent(req.query.location)}?alt=media&token=${
            results[0].metadata.firebaseStorageDownloadTokens
          });`
        );
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Some error has occured. Error: ${err}`);
      });
  }
});

/************************************************************
 *                      FEEDBACK                            *
 * **********************************************************
 * GET (retrieve all feedback)
 * GET/:key (retrieve single feedback via key)
 * PUT/:store/:id (update feedback via key)
 * DELETE/:store/:id (delete feedback via key)
 * GET/feedbackchart (retrieve ONE feedback)
 ************************************************************/

router.get("/api/v1/feedback", (req, res) => {
  db.ref("feedback")
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Internal server error! Error: ${error}`);
    });
});

router.get("/api/v1/feedback/:key", (req, res) => {
  db.ref("feedback")
    .child(req.params.key)
    .once("value")
    .then((snapshot) => {
      if (snapshot.val() !== null) {
        res.send(snapshot.val());
      } else {
        res.status(400).send("ID not found.");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Internal server error! Error: ${error}`);
    });
});

router.put("/api/v1/feedback/:key", (req, res) => {
  var dataRef = db.ref("feedback");
  var childRef = dataRef.child(req.params.key);

  childRef.update(req.body, function (error) {
    if (error) {
      console.error(error);
      res.status(400).send(error);
    } else {
      res.send("OK");
    }
  });
});

router.delete("/api/v1/feedback/:key", (req, res) => {
  var dataRef = db.ref("feedback");
  var childRef = dataRef.child(req.params.key);

  childRef.remove(function (error) {
    if (error) {
      console.error(error);
      res.status(400).send(error);
    } else {
      res.send("OK");
    }
  });
});

router.get("/api/v1/feedbackchart", (req, res) => {
  db.ref("feedback")
    .limitToLast(1)
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
    })
    .catch((error) => {
      console.err(error);
      res.status(500).send(`Internal server error! Error: ${error}`);
    });
});

/********************************************************************************************************************
 *                                                     USERS                                                        *
 * ******************************************************************************************************************
 * GET (retrieve all users)
 * => Only return the first 1000 users.
      IF all users exceeds 1000, returns a token object which can be passed as query to retrieve users > 1000.
        => /api/v1/allusers?token={insert token here}
      Else if users < 1000 or any users > 1000 be ignored, no need for token query
        => /api/v1/allusers
 *
 ********************************************************************************************************************/

router.get("/api/v1/allusers", (req, res) => {
  function listAllUsers(nextPageToken) {
    admin
      .auth()
      .listUsers(1000, nextPageToken)
      .then(function (listUsersResult) {
        let userObj = [];
        listUsersResult.users.forEach(function (userRecord) {
          userObj.push(userRecord);
        });
        if (listUsersResult.pageToken) {
          userObj.push({ token: listUsersResult.pageToken });
          res.send(userObj);
          // List next batch of users.
        } else {
          res.send(userObj);
        }
      })
      .catch(function (error) {
        console.error("Error listing users:", error);
        res.status(500).send(`Internal server error! Error: ${error}`);
      });
  }

  if (req.query.token) {
    listAllUsers(req.query.token);
  } else {
    listAllUsers();
  }
});

/************************************************************
 *                        ROLES                             *
 * **********************************************************
 * #TODO
 ************************************************************/
router.get("/api/v1/role", (req,res) => {
  db.ref('users/').once('value').then( snapshot => {
    return res.status(200).send(snapshot.val())
  });
});

/************************************************************
 *                        CHART                             *
 * **********************************************************
 * #TODO
 ************************************************************/
//return amount of cases by today's date
router.get("/api/v1/casestodaychart", (req, res) => {
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  var monthsInName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var monthName = monthsInName[month - 1];
  var currentDate = date + "-" + monthName + "-" + year;
  console.log(currentDate);
  db.ref("reports")
    .orderByChild("date")
    .equalTo(currentDate)
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
    })
    .catch((error) => {
      console.err(error);
      //console.log(currentDate);
      res.status(500).send(`Internal server error! Error: ${error}`);
    });
});

//return amount of cases by yesterday date
router.get("/api/v1/casesyesterdaychart", (req, res) => {
  var date = new Date().getDate() - 1;
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  var lastdayofmonth = new Date(year, month - 1, 0).getDate();
  if (date == 0) {
    date = lastdayofmonth;
    month -= 1;
  }
  var monthsInName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var monthName = monthsInName[month - 1];
  var yesterdayDate = date + "-" + monthName + "-" + year;
  console.log("yesterdayDate");
  console.log(yesterdayDate);
  db.ref("reports")
    .orderByChild("date")
    .equalTo(yesterdayDate)
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
    })
    .catch((error) => {
      console.err(error);
      //console.log(currentDate);
      res.status(500).send(`Internal server error! Error: ${error}`);
    });
});

//return amount of cases by the day before yesterday date
router.get("/api/v1/casesthedaybeforeytdchart", (req, res) => {
  var date = new Date().getDate() - 2;
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  console.log(thedaybeforeytdDate);
  var lastdayofmonth = new Date(year, month - 1, 0).getDate();
  if (date == 0) {
    date = lastdayofmonth;
    month -= 1;
  }
  if (date == -1) {
    date = lastdayofmonth - 1;
    month -= 1;
  } else {
  }
  var monthsInName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var monthName = monthsInName[month - 1];
  var thedaybeforeytdDate = date + "-" + monthName + "-" + year;
  console.log("thedaybeforeytdDate");
  console.log(thedaybeforeytdDate);
  db.ref("reports")
    .orderByChild("date")
    .equalTo(thedaybeforeytdDate)
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
    })
    .catch((error) => {
      console.err(error);
      //console.log(currentDate);
      res.status(500).send(`Internal server error! Error: ${error}`);
    });
});

//feedback compliment chart
router.get("/api/v1/feedbackcomplimentchart", (req, res) => {
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  var monthsInName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var monthName = monthsInName[month - 1];
  var currentDate = date + "-" + monthName + "-" + year;
  console.log(currentDate);
  db.ref("feedback")
    .orderByChild("date")
    .equalTo(currentDate)
    .once("value")
    .then((snapshot) => {
      var returnVal = [];
      snapshot.forEach((item) => {
        if (item.val().standard == "Compliment/表扬") {
          returnVal.push(item.val());
        }
      });
      return res.send(returnVal);
    })
    .catch((error) => {
      console.err(error);
      //console.log(currentDate);
      res.status(500).send(`Internal server error! Error: ${error}`);
    });
});

//feedback complaint chart
router.get("/api/v1/feedbackcomplaintchart", (req, res) => {
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  var monthsInName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var monthName = monthsInName[month - 1];
  var currentDate = date + "-" + monthName + "-" + year;
  console.log("currentDate");
  console.log(currentDate);
  db.ref("feedback")
    .orderByChild("date")
    .equalTo(currentDate)
    .once("value")
    .then((snapshot) => {
      var returnVal = [];
      snapshot.forEach((item) => {
        if (item.val().standard == "Feedback/反馈") {
          returnVal.push(item.val());
        }
      });
      return res.send(returnVal);
    })
    .catch((error) => {
      console.err(error);
      //console.log(currentDate);
      res.status(500).send(`Internal server error! Error: ${error}`);
    });
});

module.exports = router;

/**
 * #TODO
 * swagger jsdoc integration
 * merge and integrate express-validator
 */
