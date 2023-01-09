const getAllEventsModel = async (req, res, next) => {
  try {
    const students = await firestore.collection("eventos");
    const data = await students.get();
    const studentsArray = [];
    if (data.empty) {
      res.status(404).send("No Event record found");
    } else {
      data.forEach((doc) => {
        studentsArray.push({
          id: doc.id,
          data: doc.data,
        });
      });
      res.send(studentsArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = getAllEventsModel