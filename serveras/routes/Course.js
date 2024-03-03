const express = require("express");
const router = express.Router();
const { Courses } = require("../models");
const { validateToken } = require("../middleware/Authmiddleware");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  try {
    const listOfCourses = await Courses.findAll();

    if (listOfCourses.length === 0) {
      // Respond with 404 if no jobs are found
      return res.status(404).json({ error: "No Courses found" });
    }

    // Respond with 200 and the list of jobs
    res.status(200).json(listOfCourses);
  } catch (error) {
    console.error("Error fetching Courses list:", error);

    // Respond with 500 for any unexpected errors
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
