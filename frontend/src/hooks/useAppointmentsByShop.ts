import { useQuery } from "@tanstack/react-query";
import { getAppointmentsByShop } from "@/api/appointments";

export const useAppointmentsByShop = (shopId: number | undefined) => {
  return useQuery({
    queryKey: ["appointments", "shop", shopId],
    queryFn: () => getAppointmentsByShop(shopId!),
    enabled: !!shopId,
  });
};
