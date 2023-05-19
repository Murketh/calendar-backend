const { Router } = require("express");
const { check } = require("express-validator");

const { fieldsValidator } = require("../middlewares/fieldsValidator");
const { tokenValidator } = require("../middlewares/tokenValidator");

const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");

const { isDate } = require("../helpers/isDate");

const router = Router();

// All the routes need a valid token
router.use(tokenValidator);

router.get("/", getEvents);

router.post(
  "/",
  [
    check("title", "The title is required").not().isEmpty(),
    check("start", "The start date is required").custom(isDate),
    check("end", "The end date is required").custom(isDate),
    fieldsValidator,
  ],
  createEvent
);

router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

module.exports = router;
