const { response } = require("express");
const firebase = require("../db");
const firestore = firebase.firestore();
const admin = require("firebase-admin");

const addTicket = async (req, res, next) => {
  try {
    const data = req.body;

    await firestore.collection("ingressos").doc().create(data);

    res.send({ message: "Record saved successfuly" });
  } catch (error) {
    if (error.code === "auth/id-token-expired") {
      res.status(400).send("Sessão expirada");
    }
    res.status(400).send(error.message);
  }
};
const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tktRef = await firestore.collection("ingressos").doc(id);
    await tktRef.update({ online: false, isUsed: true });
    res.send({ message: "Entrada Garantida" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getTicketId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tktsId = await firestore
      .collection("ingressos")
      .where("buyId", "==", id);
    const data = await tktsId.get();
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

const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tktRef = await firestore.collection("ingressos").doc(id);
    await tktRef.update({ isValid: true });
    res.send({ message: "atualizado status" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getTicketsToSave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const students = await firestore
      .collection("ingressos")
      .where("buyId", "==", id);
    const data = await students.get();
    const eventsArray = [];
    if (data.empty) {
      res.status(404).send("No Event record found");
    } else {
      data.forEach((doc) => {
        eventsArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      res.send(eventsArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const students = await firestore
      .collection("ingressos")
      .where("cpf", "==", id);
    const data = await students.get();
    const tkt = [];
    if (data.empty) {
      res.status(404).send("No Event record found");
    } else {
      data.forEach((doc) => {
        if (doc.data().isValid) {
          tkt.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });
      res.send(tkt);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getTicketToBurn = async (req, res, next) => {
  try {
    const id = req.params.id;
    const ticket = await firestore.collection("ingressos").doc(id);
    const data = await ticket.get();
    if (!data.exists) {
      res.status(404).send("tkt with the given ID not found");
    } else {
      res.send(data.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllTkts = async (req, res, next) => {
  try {
    const events = await firestore
      .collection("ingressos")
      .where("ticketDate", "==", "");
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
      const pass = "Passaporte - Estudantil";
      const passaporte = [];
      const rnsArr = [];

      const dataPassaporte = "2023-01-24T03:00:00.000Z";
      const dataRioNegro = "2023-01-28T03:00:00.000Z";

      eventsArray.forEach((evt) => {
        if (evt.data.ticketName === pass) {
          passaporte.push(evt);
        } else {
          rnsArr.push(evt);
        }
      });
      let pssRes = "";
      let rnRss = "";

      // await Promise.all(
      //   passaporte.map(async (tkt) => {
      //     console.log(tkt.id);
      //     try {
      //       const tktRef = await firestore.collection("ingressos").doc(tkt.id);
      //       await tktRef.update({ isValid: true });
      //       pssRes = { message: "atualizado data" };
      //     } catch (error) {
      //       pssRes = error.message;
      //     }
      //   })
      // );

      // await Promise.all(
      //   rnsArr.map(async (tkt) => {
      //     console.log(tkt.id);
      //     try {
      //       const tktRef = await firestore.collection("ingressos").doc(tkt.id);
      //       await tktRef.update({ isValid: true });
      //       rnRss = { message: "atualizado data" };
      //     } catch (error) {
      //       rnRss = error.message;
      //     }
      //   })
      // );

      res.send({ rnRss });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getTicketInvalid = async (req, res, next) => {
  try {
    const students = await firestore
      .collection("compras")
      .where("isValid", "==", false);
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

      await Promise.all(
        eventsArray.map(async (tkt) => {
          try {
            const tktRef = await firestore.collection("compras").doc(tkt.id);
            await tktRef.update({ isValid: true });
            rnRss = { message: "atualizado validade" };
          } catch (error) {
            rnRss = error.message;
          }
        })
      );

      res.send(eventsArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// const getTicketInvalid = async (req, res, next) => {
//   try {
//     const students = await firestore
//       .collection("compras")
//       .where("isValid", "==", false);
//     const data = await students.get();
//     const tkt = [];
//     if (data.empty) {
//       res.status(404).send("No Event record found");
//     } else {
//       data.forEach((doc) => {
//         tkt.push({
//           id: doc.id,
//           ...doc.data(),
//         });
//       });

//       // await Promise.all(
//       //   tkt.map(async (tkt) => {
//       //     try {
//       //       const tktRef = await firestore.collection("compras").doc(tkt.id);
//       //       await tktRef.update({ isValid: true });
//       //       rnRss = { message: "atualizado validade" };
//       //     } catch (error) {
//       //       rnRss = error.message;
//       //     }
//       //   })
//       // );
//       res.send(tkt);
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

module.exports = {
  addTicket,
  updateTicket,
  getTicketsToSave,
  getTicket,
  getTicketToBurn,
  updateTicketStatus,
  getTicketId,
  getAllTkts,
  getTicketInvalid,
};
