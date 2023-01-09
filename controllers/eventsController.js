const { response } = require("express");
const firebase = require("../db");
const firestore = firebase.firestore();
const admin = require("firebase-admin");

const getSmall = (prices) => {
  let pricesArr = prices.map((value) => {
    return value.price;
  });
  return Math.min(...pricesArr);
};

const getShortMonthName = (month) => {
  const monthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return monthNames[month];
};

const addEvent = async (req, res, next) => {
  try {
    const data = req.body;
    const smallPrice = getSmall(data.prices);
    const month = getShortMonthName(data.month);
    const event = {
      ...data,
      isEnabled: true,
      price: smallPrice,
      month,
    };

    await firestore.collection("eventos").doc().set(event);
    res.send("Record saved successfuly");
  } catch (error) {
    if (error.code === "auth/id-token-expired") {
      res.status(400).send("Sessão expirada");
    }
    res.status(400).send(error.message);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const students = await firestore
      .collection("eventos")
      .where("status", "==", "active");
    // .orderBy("createdAt", "desc");
    const data = await students.get();
    const eventsArray = [];
    if (data.empty) {
      res.status(404).send("No Event record found");
    } else {
      data.forEach((doc) => {
        eventsArray.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      res.send(eventsArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllMyEvents = async (req, res, next) => {
  const { id } = req.params;
  try {
    const events = await firestore
      .collection("eventos")
      .where("userId", "==", id);
    const data = await events.get();
    const eventsArray = [];
    if (data.empty) {
      res.status(404).send("No Event record found");
    } else {
      data.forEach((doc) => {
        eventsArray.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      res.send(eventsArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const Event = await firestore.collection("eventos").doc(id);
    const data = await Event.get();
    if (!data.exists) {
      res.status(404).send("Event with the given ID not found");
    } else {
      res.send(data.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const smallPrice = getSmall(data.prices);
    const month = getShortMonthName(data.month);
    const event = {
      ...data,
      price: smallPrice,
      month,
    };

    const Event = await firestore.collection("eventos").doc(id);
    await Event.update(event);
    res.send("Event record updated successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const disableEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tktRef = await firestore.collection("eventos").doc(id);
    await tktRef.update({ status: "disabled" });
    res.status(200).send("Sessão expirada");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    await firestore.collection("eventos").doc(id).delete();
    res.send("Record deleted successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const enableEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tktRef = await firestore.collection("eventos").doc(id);
    await tktRef.update({ status: "active" });
    res.status(200).send("Sessão expirada");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getAllMyEvents,
  disableEvent,
  enableEvent,
};
