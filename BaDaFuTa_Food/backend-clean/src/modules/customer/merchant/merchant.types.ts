import { z } from "zod";
import { MerchantListQuery } from "./merchant.validation";

export type MerchantFindArgs = z.infer<typeof MerchantListQuery>;
