// @/modules/shop/services/IShopService.ts
import type { ShopPayload, ShopResponse } from "../types/shop.types";
import type { z } from "zod";

/**
 * The interface describing the methods needed for "Shop" logic.
 *
 * Adjust based on how your backend is structured
 * (e.g. if you do create, list, read, update, add seat, etc.)
 */
export interface ShopService {
  listShops(): Promise<ShopResponse[]>; // GET /api/shops
  createShop(payload: ShopPayload): Promise<ShopResponse>; // POST /api/shops
  updateShop(shopId: string, payload: ShopPayload): Promise<ShopResponse>; // PUT /api/shops/{shopId}
  deleteShop(shopId: string): Promise<void>; // DELETE /api/shops/{shopId}
  getShop(shopId: string): Promise<ShopResponse>; // GET /api/shops/{shopId} -- OPEN TO ALL
  // return all shops owned by the owner
  getShopsByOwner(): Promise<ShopResponse[]>;
}
