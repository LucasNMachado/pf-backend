import { Router } from "express";
import userModel from "../dao/models/usersModel.js";
import { createHash } from "../utils/utils.js";
import passport from "passport";
import UsersDTO from "../dto/usersDto.js";
import { isAdmin, isUser } from "../middlewares/role.js";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failregister",
  }),
  async (req, res) => {
    res.send({ status: "success", message: "User registered" });
  }
);

router.get("/failregister", (req, res) => {
  res.status(400).send({ status: "error", error: "Registry fail" });
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", error: "Incorrect credentials" });

    req.session.user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      email: req.user.email,
      age: req.user.age,
    };
    res.send({
      status: "success",
      payload: req.session.user,
      message: "¡Primer logueo realizado! :)",
    });
  }
);

router.get("/faillogin", (req, res) => {
  res.status(400).send({ status: "error", error: "Login fail" });
});

router.put("/restartPassword", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      status: "error",
      error: "Incomplete Values",
    });
  }

  const user = await userModel.findOne({ email });

  if (!user)
    return res.status(404).send({ status: "error", error: "Not user found" });

  const newHashedPassword = createHash(password);

  await userModel.updateOne(
    { _id: user._id },
    { $set: { password: newHashedPassword } }
  );

  res.send({ status: "success", message: "Contraseña restaurada" });
});

// dto
router.get("/current", (req, res) => {
  if (req.isAuthenticated()) {
    const userDTO = new UsersDTO(req.user);
    res.send({ status: "success", payload: userDTO });
  } else {
    res.status(401).send({ status: "error", error: "User not authenticated" });
  }
});

// crear producto (admin)
router.post("/products", isAdmin, async (req, res) => {
  res.send({ status: "success", message: "Product created" });
});

// actualizar producto (admin)
router.put("/products/:id", isAdmin, async (req, res) => {
  res.send({ status: "success", message: "Product updated" });
});
// eliminar producto (admin)
router.delete("/products/:id", isAdmin, async (req, res) => {
  res.send({ status: "success", message: "Product deleted" });
});

// enviar mensaje (usuario)
router.post("/chat", isUser, async (req, res) => {
  res.send({ status: "success", message: "Message sent" });
});

// agregar al carrito (usuario)
router.post("/cart", isUser, async (req, res) => {
  res.send({ status: "success", message: "Product added to cart" });
});

export default router;