"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/modules/shadcn/ui/button";
import { seatSchema, type SeatResponse } from "@/modules/seat/types/seat.types";
import { seatService } from "@/modules/seat/services";

type CreateSeatPayload = {
  seatName: string;
};

export default function SeatManagementPage() {
  const router = useRouter();
  const params = useParams();
  const shopId = params.shopId as string;

  const [seats, setSeats] = useState<SeatResponse[]>([]);
  // Store editingSeatId as a string (or null) to match route params and seatService
  const [editingSeatId, setEditingSeatId] = useState<string | null>(null);
  const [editingSeatName, setEditingSeatName] = useState<string>("");

  // Form for adding a new seat
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSeatPayload>({
    resolver: zodResolver(seatSchema),
    defaultValues: { seatName: "" },
  });

  // Fetch seats on mount
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const data = await seatService.listSeatsByShop(shopId);
        setSeats(data);
      } catch (error) {
        console.error("Failed to load seats:", error);
      }
    };
    if (shopId) fetchSeats();
  }, [shopId]);

  // Handler for adding a seat
  const onCreateSeat = async (payload: CreateSeatPayload) => {
    try {
      const newSeat = await seatService.createSeat(shopId, payload);
      setSeats((prev) => [...prev, newSeat]);
      reset({ seatName: "" });
    } catch (error) {
      console.error("Failed to create seat:", error);
    }
  };

  // Begin editing
  const startEditing = (seat: SeatResponse) => {
    setEditingSeatId(String(seat.id)); // <-- changed
    setEditingSeatName(seat.seatName);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSeatId(null);
    setEditingSeatName("");
  };

  // Save seat edits
  const saveEdit = async (numericSeatId: number) => {
    try {
      // Convert numeric seat ID to string before passing to seatService
      const seatIdAsString = String(numericSeatId); // <-- changed
      const updatedSeat = await seatService.updateSeat(
        shopId,
        seatIdAsString,
        {
          seatName: editingSeatName,
        },
      );
      setSeats((prev) =>
        prev.map((seat) => (seat.id === numericSeatId ? updatedSeat : seat)),
      );
      cancelEditing();
    } catch (error) {
      console.error("Failed to update seat:", error);
    }
  };

  // Remove seat
  const removeSeat = async (numericSeatId: number) => {
    try {
      const seatIdAsString = String(numericSeatId); // <-- changed
      await seatService.deleteSeat(shopId, seatIdAsString);
      setSeats((prev) => prev.filter((seat) => seat.id !== numericSeatId));
    } catch (error) {
      console.error("Failed to remove seat:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Seat Management</h1>
            <p className="text-slate-500 mt-1">Add, edit, and assign barbers to seats</p>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href={`/shops/${shopId}`}>← Back to Shop</Link>
          </Button>
        </div>

        {/* Create New Seat */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Add a New Seat</h2>
          <form
            onSubmit={handleSubmit(onCreateSeat)}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-end"
          >
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-medium text-slate-700">Seat Name</label>
              <input
                {...register("seatName")}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="e.g. Seat #1"
              />
              {errors.seatName && (
                <p className="text-red-500 text-sm">{errors.seatName.message}</p>
              )}
            </div>
            <Button type="submit" className="premium-gradient border-none rounded-xl px-6 py-3 font-bold text-white shadow-md hover:shadow-lg transition-all">
              Add Seat
            </Button>
          </form>
        </div>

        {/* Existing Seats */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Existing Seats</h2>
          {seats.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-500">No seats yet. Add your first seat above.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {seats.map((seat) => {
                const isEditing = editingSeatId === String(seat.id);
                return (
                  <li
                    key={seat.id}
                    className="p-4 bg-white border border-slate-100 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition-all"
                  >
                    {isEditing ? (
                      <>
                        <input
                          value={editingSeatName}
                          onChange={(e) => setEditingSeatName(e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none flex-1 mr-4"
                        />
                        <div className="flex gap-2">
                          <Button variant="default" className="rounded-xl" onClick={() => saveEdit(seat.id)}>Save</Button>
                          <Button variant="outline" className="rounded-xl" onClick={cancelEditing}>Cancel</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="font-semibold text-slate-800">{seat.seatName}</span>
                          <span className="ml-3 text-sm text-slate-500">
                            {seat.barberFullName ? `— ${seat.barberFullName}` : "— Unassigned"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="rounded-xl text-sm" onClick={() => startEditing(seat)}>Edit</Button>
                          <Button variant="destructive" className="rounded-xl text-sm" onClick={() => removeSeat(seat.id)}>Delete</Button>
                          <Button asChild variant="secondary" className="rounded-xl text-sm">
                            <Link href={`/shops/${shopId}/seats/${seat.id}/assign`}>Assign</Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
