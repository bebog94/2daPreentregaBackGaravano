import express from 'express'
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import messageRouter from "./routes/messages.router.js";


//DB
import "./dao/db/configDB.js"


const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"));


app.engine('handlebars', engine({
  defaultLayout: "main",
  runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
  }
}));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)
app.use('/api/messages', messageRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(8080, () => {
  console.log("Escuchando al puerto 8080");
});

const socketServer = new Server(httpServer);
const messages = [];
socketServer.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  socket.on("newUser", (user) => {
    socket.broadcast.emit("userConnected", user);
    socket.emit("connected");
  });
  socket.on("message", (infoMessage) => {
    messages.push(infoMessage);
    socketServer.emit("chat", messages);
  });
});