import express from "express";
import { loginCustomer } from "../controllers/loginCustomerController.js";

const router = express.Router();
router.post("/", loginCustomer);

export default router;
