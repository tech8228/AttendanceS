const express = require("express");
const router = express.Router();
const { Students } = require("../models");
const { validateToken } = require("../middleware/Authmiddleware");
const { Op } = require("sequelize");

// router.get("/", (req, res) => {
//   res.send("Hello from the server!");
// });

router.get("/", async (req, res) => {
  try {
    const listOfStudents = await Students.findAll({
      where: {
        Password: {
          [Op.eq]: null,
        },
      },
    });

    if (listOfStudents.length === 0) {
      return res.status(404).json({ error: "No Student found" });
    }

    res.status(200).json(listOfStudents);
  } catch (error) {
    console.error("Error fetching Student list:", error);

    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const JobID = req.params.id;
    const job = await Students.findByPk(JobID);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job:", error);

    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", validateToken, async (req, res) => {
  try {
    const job = req.body;
    const jobId = req.userToken.id;
    job.JobId = jobId;
    await Students.create(job);
    res.status(200).json(job);
  } catch {
    console.error("Error creating job:", error);

    // Check for specific Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      // If validation error, return 400 Bad Request with error details
      return res
        .status(400)
        .json({ error: "Validation error", details: error.errors });
    }

    // Return 500 for any other unexpected error
    res.status(500).json({ error: "Internal server error" });
  } //res.json(true)
});

router.get("/search", async (req, res) => {
  console.log("reached search");
  try {
    const { name } = req.query;

    // Build the search criteria based on query parameters
    const whereClause = {};
    if (name) {
      whereClause.StudentName = { [Op.like]: `%${title}%` };
    }

    const searchResults = await Students.findAll({
      where: whereClause,
    });

    res.status(200).json(searchResults);
  } catch (error) {
    console.error("Error searching jobs:", error);

    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
