"use client";

import { useState } from "react";
import { useServices, useCreateService, useUpdateService, useDeleteService } from "@/hooks/useServices";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/shadcn/ui/card";
import { Button } from "@/modules/shadcn/ui/button";
import { Input } from "@/modules/shadcn/ui/input";
import { Alert, AlertDescription } from "@/modules/shadcn/ui/alert";
import { Badge } from "@/modules/shadcn/ui/badge";
import { Loader2, Plus, Edit, Trash2, Scissors, Clock, DollarSign, CheckCircle2, XCircle } from "lucide-react";
import type { ServiceResponse } from "@/types/service";

export default function ServicesManagementPage() {
  const { data: services, isLoading, error } = useServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceResponse | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
    active: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      durationMinutes: "",
      active: true,
    });
    setEditingService(null);
    setIsFormOpen(false);
  };

  const handleEdit = (service: ServiceResponse) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      durationMinutes: service.durationMinutes.toString(),
      active: service.active,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serviceData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      durationMinutes: parseInt(formData.durationMinutes),
      active: formData.active,
    };

    if (editingService) {
      updateMutation.mutate(
        { id: editingService.id, data: serviceData },
        { onSuccess: resetForm }
      );
    } else {
      createMutation.mutate(serviceData, { onSuccess: resetForm });
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load services. Please try again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Service Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your barbershop services, prices, and durations
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>

        {/* Form */}
        {isFormOpen && (
          <Card>
            <CardHeader>
              <CardTitle>{editingService ? "Edit Service" : "Add New Service"}</CardTitle>
              <CardDescription>
                {editingService ? "Update service details" : "Create a new service for your barbershop"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Service Name *
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Haircut"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Price (ETB) *
                    </label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="150.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="duration" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Duration (minutes) *
                    </label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                      placeholder="30"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Status
                    </label>
                    <select
                      id="active"
                      value={formData.active ? "true" : "false"}
                      onChange={(e) => setFormData({ ...formData, active: e.target.value === "true" })}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the service"
                    rows={3}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingService ? "Update Service" : "Create Service"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services?.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Scissors className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                  </div>
                  <Badge variant={service.active ? "default" : "secondary"}>
                    {service.active ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </Badge>
                </div>
                {service.description && (
                  <CardDescription className="mt-2">{service.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>Price</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{service.price} ETB</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Duration</span>
                  </div>
                  <span className="font-medium">{service.durationMinutes} min</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(service.id, service.name)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {services?.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Scissors className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No services found. Add your first service to get started.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
