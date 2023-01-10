const express = require("express");

const {
  addEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  // deleteEvent,
  getAllMyEvents,
  disableEvent,
  enableEvent,
} = require("../controllers/eventsController");
const checkIntegrity = require("../middleware/middleware");

const {
  addPurchase,
  getAllPurchases,
  getPurchase,
  getPurchasetId,
  updatePurchaseStatus,
} = require("../controllers/purchasesController");

const {
  addTicket,
  updateTicket,
  getTicketsToSave,
  getTicket,
  getTicketToBurn,
  updateTicketStatus,
  getTicketId,
} = require("../controllers/ticketController");
const {
  getAllMySales,
  getAdmAuth,
  createPayment,
  deploy,
} = require("../controllers/generalController");

const router = express.Router();

router.post("/", deploy);

router.post("/createPayment", createPayment);
router.get("/getAllMySales/:id", checkIntegrity, getAllMySales);
router.get("/getAdmAuth/:id", checkIntegrity, getAdmAuth);
router.get("/getPurchasetId/:id", getPurchasetId);
router.put("/updatePurchaseStatus/:id", updatePurchaseStatus);

router.post("/addEvent", checkIntegrity, addEvent);
router.get("/getAllMyEvents/:id", checkIntegrity, getAllMyEvents);

router.get("/getAllEvents", getAllEvents);
router.get("/getEvent/:id", getEvent);
router.put("/updateEvent/:id", checkIntegrity, updateEvent);
router.put("/disableEvent/:id", checkIntegrity, disableEvent);
router.put("/enableEvent/:id", checkIntegrity, enableEvent);

// router.delete("/deleteEvent/:id", deleteEvent);

router.post("/addPurchase", addPurchase);
router.get("/getAllPurchases", checkIntegrity, getAllPurchases);
router.get("/getPurchase/:id", checkIntegrity, getPurchase);

router.post("/addTicket", addTicket);
router.get("/getTicketsToSave/:id", getTicketsToSave);
router.get("/getTicket/:id", getTicket);
router.get("/getTicketId/:id", getTicketId);
router.get("/getTicketToBurn/:id", checkIntegrity, getTicketToBurn);
router.put("/updateTicket/:id", checkIntegrity, updateTicket);
router.put("/updateTicketStatus/:id", updateTicketStatus);

module.exports = {
  routes: router,
};
