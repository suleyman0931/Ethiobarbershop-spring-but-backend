import { ShopServiceImpl } from "./shop.service.impl";
import type { ShopService } from "./shop.service";

const shopService: ShopService = new ShopServiceImpl();

export { shopService };
