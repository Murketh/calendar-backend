//* Auth routes
//* localhost:4000/api/auth
const { Router } = require("express");
const { check } = require("express-validator");

const router = Router();

const { fieldsValidator } = require("../middlewares/fieldsValidator");
const { tokenValidator } = require("../middlewares/tokenValidator");
const { registerUser, loginUser, renewToken } = require("../controllers/auth");

router.post(
  "/",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password must have at least 6 characters").isLength({
      min: 6,
    }),
    fieldsValidator,
  ],
  loginUser
);

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must have at least 6 characters").isLength({
      min: 6,
    }),
    fieldsValidator,
  ],
  registerUser
);

router.get("/renewToken", tokenValidator, renewToken);

module.exports = router;
