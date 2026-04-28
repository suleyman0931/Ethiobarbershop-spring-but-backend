import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllServices, getAllActiveServices, createService, updateService, deleteService } from "@/api/services";
import type { ServiceResponse } from "@/types/service";

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: getAllServices,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<ServiceResponse, "id">) => createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ServiceResponse> }) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
