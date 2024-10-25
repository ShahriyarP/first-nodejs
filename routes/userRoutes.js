const express = require("express");
const {
  createUser,
  updateUser,
  getUsers,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);
router.put("/", updateUser);
router.get("/", getUsers);
router.delete("/", deleteUser);

module.exports = router;
