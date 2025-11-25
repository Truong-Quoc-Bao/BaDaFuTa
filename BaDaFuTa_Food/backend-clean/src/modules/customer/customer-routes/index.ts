import { Router } from "express";
import merchantRouter from "../merchant/merchant.route";
import menuRouter from "../menu-item/menu-item.route";
import { userRoutes } from "../users";
import { paymentRoute } from "../vnpay";
import { orderRoute } from "../order";
import { otpRoute } from "../otp";
import { momoRoute } from "../momo";
import { voucherRoutes } from "../voucher";

const router = Router();

router.use("/restaurants", merchantRouter);
router.use("/restaurants/:restaurantId", menuRouter);
router.use("/", userRoutes);
router.use("/payment", paymentRoute);
router.use("/order", orderRoute);
router.use("/otp", otpRoute);
router.use("/momo", momoRoute);
router.use("/voucher", voucherRoutes);

export default router;
