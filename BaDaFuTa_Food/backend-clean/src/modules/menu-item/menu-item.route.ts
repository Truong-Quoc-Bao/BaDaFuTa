// src/modules/menu-item/menu-item.route.ts
import { Router } from "express";
import { listMenu } from "./menu-item.controller";
import { ProductDetail } from "./product-item.controller";

const router = Router({ mergeParams: true }); // ⚡ bắt buộc

router.get("/menu", listMenu);
router.get("/menu/:menuItemId/detail", ProductDetail);

export default router;
