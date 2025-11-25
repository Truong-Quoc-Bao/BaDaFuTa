
import type { MerchantFindArgs } from "./merchant.types";
import * as Repo from "./merchant.repository";

export async function listMerchants(args: MerchantFindArgs) {
  if (args.withMeta) {
    const [items, total] = await Promise.all([
      Repo.findMany(args),
      Repo.count(args),
    ]);
    return { items, meta: { total } };
  }
  return Repo.findMany(args);
}
