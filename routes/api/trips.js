// Dependencies
const router = require("express").Router();
const tripController = require("../../controllers/tripController");

// Routes for /api/trips
router.route("/").get(tripController.findAll).post(tripController.create);

// Routes for /api/trips/:id
router
  .route("/:id")
  // .get(tripController.findById)
  .get(tripController.findByIdwithExpenses) // return the trip with the expenses
  .put(tripController.update)
  .delete(tripController.remove);


// Export
module.exports = router;
