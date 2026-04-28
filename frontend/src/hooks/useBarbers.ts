import { useQuery } from "@tanstack/react-query";
import { getAllBarbers, getBarberById } from "@/api/barbers";

export const useBarbers = () => {
  return useQuery({
    queryKey: ["barbers"],
    queryFn: getAllBarbers,
  });
};

export const useBarber = (id: number) => {
  return useQuery({
    queryKey: ["barbers", id],
    queryFn: () => getBarberById(id),
    enabled: !!id,
  });
};
