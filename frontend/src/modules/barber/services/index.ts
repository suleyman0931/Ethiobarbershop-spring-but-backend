import { BarberServiceImpl } from "./barber.service.impl";
import type { BarberService } from "./barber.service";

const barberService: BarberService = new BarberServiceImpl();

export { barberService };
