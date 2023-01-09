const { response } = require("express");
const firebase = require("../db");
const firestore = firebase.firestore();
const admin = require("firebase-admin");

const addPurchase = async (req, res, next) => {
  try {
    const data = req.body;
    const docRef = await firestore.collection("compras").doc().set(data);
    res.send({ message: "Record saved successfuly", docId: docRef });
  } catch (error) {
    if (error.code === "auth/id-token-expired") {
      res.status(400).send("Sessão expirada");
    }
    res.status(400).send(error.message);
  }
};

const getAllPurchases = async (req, res, next) => {
  try {
    const students = await firestore
      .collection("compras")
      .where("status", "==", "active");
    // .orderBy("createdAt", "desc");
    const data = await students.get();
    const eventsArray = [];
    if (data.empty) {
      res.status(404).send("No Event record found");
    } else {
      data.forEach((doc) => {
        if (doc.isValid) {
          eventsArray.push({
            id: doc.id,
            data: doc.data(),
          });
        }
      });
      res.send(eventsArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getPurchasetId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const purchaseTkt = await firestore
      .collection("compras")
      .where("buyId", "==", id);
    const data = await purchaseTkt.get();
    const tkt = [];
    if (data.empty) {
      res.status(404).send("No Event record found");
    } else {
      data.forEach((doc) => {
        tkt.push({
          id: doc.id,
        });
      });
      res.send(tkt);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getPurchase = async (req, res, next) => {
  try {
    const id = req.params.id;
    const Event = await firestore.collection("compras").doc(id);
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
const updatePurchaseStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tktRef = await firestore.collection("compras").doc(id);
    await tktRef.update({ isValid: true });
    res.send({ message: "atualizado status" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addPurchase,
  getAllPurchases,
  getPurchase,
  getPurchasetId,
  updatePurchaseStatus,
};
