// src/routes/index.ts (hoặc nơi bạn khai báo root router)
import { Router } from "express";
import merchantRouter from "../modules/merchant/merchant.route";
import menuRouter from "../modules/menu-item/menu-item.route";
import { userRoutes } from "../modules/users";
import { paymentRoute } from "../modules/vnpay";
import { orderRoute } from "../modules/order";

const router = Router();

router.use("/restaurants", merchantRouter);
router.use("/restaurants/:restaurantId", menuRouter);
router.use("/", userRoutes);
router.use("/payment", paymentRoute);
router.use("/order", orderRoute);

export default router;
