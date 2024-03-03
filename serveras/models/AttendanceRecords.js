module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define("AttendanceRecords", {
    RecordID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    StudentID: {
      type: DataTypes.INTEGER,
    },
    CourseID: {
      type: DataTypes.INTEGER,
    },
    AttendanceDate: {
      type: DataTypes.DATE,
    },
    Status: {
      type: DataTypes.ENUM("Present", "Absent", "Late", "Leave Permitted"),
    },
  });

  return Attendance;
};
