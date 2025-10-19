import express from "express";
import { loginCustomer, getUserInfo  } from "../controllers/loginCustomerController.js";

const router = express.Router();

router.post("/", loginCustomer); // POST /api/loginCustomer
router.get("/me", getUserInfo);  // GET /api/loginCustomer/me

export default router;



