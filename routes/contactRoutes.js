const express = require("express");
const router = express.Router();
const contactController = require("../controller/contactController");

router.get("/allusers/:id", contactController.getAllUsers);

module.exports = router;
