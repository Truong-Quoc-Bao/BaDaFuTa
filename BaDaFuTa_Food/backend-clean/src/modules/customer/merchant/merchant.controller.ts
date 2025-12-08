import type { Request, Response } from "express";
import { MerchantListQuery } from "./merchant.validation";
import * as Service from "./merchant.service";

export async function listMerchants(req: Request, res: Response) {
  try {
    const query = MerchantListQuery.parse(req.query);
    const data = await Service.listMerchants(query);

    // Quy ước: danh sách trả 200 + []
    return res.status(200).json(data);
  } catch (err: any) {
    console.error("[merchant] list error:", err?.message || err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
export async function OutStandingMerchant(req: Request, res: Response) {
  try {
    const data = await Service.OutStandingMerchant();
    return res.status(200).json(data);
  } catch (err: any) {
    console.error("[merchant] outstanding error:", err?.message || err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
