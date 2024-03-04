const express = require("express");
const router = express.Router();
const { Courses } = require("../models");
const { validateToken } = require("../middleware/Authmiddleware");
const { check } = require("express-validator");
const { validateCourse } = require("../routes/Validation");

router.get("/", async (req, res) => {
  try {
    const listOfCourses = await Courses.findAll();

    if (listOfCourses.length === 0) {
      return res.status(404).json({ error: "No Courses found" });
    }

    res.status(200).json(listOfCourses);
  } catch (error) {
    console.error("Error fetching Courses list:", error);

    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", validateCourse, async (req, res) => {
  const { CourseName } = req.body;
  if (!CourseName) {
    return res.status(400).json({ error: "Missing Course Data" });
  }
  const checkCourse = await Courses.findOne({
    where: { CourseName: CourseName },
  });

  if (!checkCourse) {
    try {
      await Courses.create({
        CourseName: CourseName,
      });
      res.json("Success");
    } catch (error) {
      console.error("Error creating Course:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.json({ error: "Course Name already exists" });
  }
});

router.delete("/delete/:id", (req, res) => {
  const courseId = req.params.id;
  Courses.destroy({
    where: {
      courseID: courseId,
    },
  })
    .then(function (deletedRecord) {
      if (deletedRecord === 1) {
        res.status(200).json({ message: "Deleted successfully" });
      } else {
        res.status(404).json({ message: "Record not found" });
      }
    })
    .catch(function (error) {
      res.status(500).json({ message: "Internal server error", error: error });
    });
});

router.get("/", validateToken, (req, res) => {
  res.json(res.user);
});

module.exports = router;
