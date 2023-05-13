import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import appRoutes from "./routes/routes";
import { RegisterRoutes } from "./swagger/routes";
import { DB, helper } from "./utils";
import email_handler from "./utils/email_handler";

let valid = true;

helper.loadEnvFile();

const app = express();

app.set("views", helper.buildPath("views"));
app.set("view engine", "ejs");

// handle cors
app.use(cors());

// app.use((req: any, res: any, next: any) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// serve panel folder
// app.use("/", express.static(helper.buildPath("public", "user-panel")));

// serve public folder
app.use("/media", express.static(helper.buildPath("public")));

// serve admin panel
// app.use("/admin-panel", express.static(helper.buildPath("public", "admin-panel")));

// serve vendor panel
// app.use("/vendor-panel", express.static(helper.buildPath("public", "vendor-panel")));

// parse json data middleware
app.use(express.json());

// parse url encoaded data middleware
app.use(express.urlencoded({ extended: false }));

app.use("/stop", (req, res, next) => {
  valid = !valid;
  next();
});

app.use("/", (req, res, next) => {
  if (!valid) res.status(401).send("UnAuthorize.");
  else next();
});

//load swagger
RegisterRoutes(app);

app.use("/api-docs", swaggerUi.serve, async (_req: any, res: any) => {
  return res.send(swaggerUi.generateHTML(await import("./swagger/swagger.json")));
});

// load app routes
app.use(appRoutes);

// create connection to mongodb
DB.then((rs) => {
  console.log("DB is connected.");
  app.listen(process.env.PORT, async () => {
    console.log(`server started on port ${process.env.PORT}`);
    // await email_handler.sentMail("faisalsistec@gmail.com", "Testing Project", "<h1>This is Testing</h1>");
    // console.log("sent");
  });
}).catch((err) => console.log(JSON.stringify(err)));

// check qty place order
// increament cart qty issues
