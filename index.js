// "use strict";
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const config = require("./config");
// const defaultRouter = require("./routes/routes");

// const app = express();

// app.use(express.json());

// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
//   })
// );res.header("Access-Control-Allow-Origin", "true");

// app.use(bodyParser.json());

// app.use("/api", defaultRouter.routes);

// app.listen(8080, () => console.log("App is listening on port " + "8080"));
"use strict";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/api", routes.routes);

app.listen(8080, () => console.log("App funcionando na porta " + 8080));
