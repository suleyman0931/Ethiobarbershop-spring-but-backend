"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { appointmentService } from "@/modules/appointment/services/appointment.service";
import type { BarberResponse } from "@/modules/barber/types/barber.types";
import type { ServiceResponse } from "@/types/service";
import type { PaymentMethod } from "@/types/payment";
import { uploadCustomerImage } from "@/api/images";
import { submitPayment } from "@/api/payments";
import { Calendar, Clock, User, Scissors, CheckCircle2, MapPin, Upload, X, Copy, Check, ArrowRight, Loader2 } from "lucide-react";

const PAYMENT_METHODS = {
  TELEBIRR: {
    name: "TeleBirr",
    account: "0931798929",
    instructions: "Transfer to TeleBirr number: 0931798929",
  },
  CBE_BIRR: {
    name: "CBE Birr",
    account: "1000747483047",
    instructions: "Transfer to CBE account: 1000747483047",
  },
};

type BookingStep = "form" | "payment" | "complete";

function BookAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBarberId = searchParams.get("barberId");

  const [currentStep, setCurrentStep] = useState<BookingStep>("form");

  // Booking fields
  const [selectedBarberId, setSelectedBarberId] = useState<number | null>(
    preselectedBarberId ? Number(preselectedBarberId) : null
  );
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Payment fields
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("TELEBIRR");
  const [transactionId, setTransactionId] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: barbers = [], isLoading: barbersLoading } = useQuery({
    queryKey: ["barbers", selectedShopId],
    queryFn: () =>
      selectedShopId
        ? apiClient.get<BarberResponse[]>(`/barbers/shop/${selectedShopId}`)
        : Promise.resolve([]),
    enabled: !!selectedShopId, // only fetch when a shop is selected
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => apiClient.get<ServiceResponse[]>("/services/active"),
  });

  const { data: shops = [], isLoading: shopsLoading } = useQuery({
    queryKey: ["shops"],
    queryFn: () => apiClient.get<any[]>("/shops"),
  });

  const selectedBarber = barbers.find(b => b.barberId === selectedBarberId);
  const selectedService = services.find(s => s.id === selectedServiceId);
  const selectedShop = shops.find((s: any) => s.id === selectedShopId);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(PAYMENT_METHODS[paymentMethod].account);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("File size must be less than 5MB"); return; }
    setScreenshotFile(file);
    setScreenshotUrl("");
    setError("");
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedBarberId) { setError("Please select a barber."); return; }
    if (!selectedServiceId) { setError("Please select a service."); return; }
    if (!selectedShopId) { setError("Please select a branch."); return; }
    if (!date || !time) { setError("Please select a date and time."); return; }
    if (!transactionId && !screenshotUrl && !screenshotFile) {
      setError("Please provide either a transaction ID or a payment screenshot.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create appointment
      const appointmentResponse = await appointmentService.book({
        barberProfileId: selectedBarberId,
        serviceId: selectedServiceId,
        ...(selectedShopId && { shopId: selectedShopId }),
        desiredTime: `${date}T${time}:00`,
      });

      // Step 2: Upload screenshot if file selected
      let finalScreenshotUrl = screenshotUrl;
      if (screenshotFile) {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Authentication token not found. Please login again.");

        const profileResponse = await apiClient.get<any>("/customers/me");
        if (!profileResponse.customerId) throw new Error("Customer profile not found.");

        const imageData = await uploadCustomerImage(profileResponse.customerId, screenshotFile, token);
        finalScreenshotUrl = imageData.fileUrl;
      }

      // Step 3: Submit payment
      const paymentData: any = { appointmentId: appointmentResponse.id, paymentMethod };
      if (transactionId?.trim()) paymentData.transactionId = transactionId.trim();
      if (finalScreenshotUrl?.trim()) paymentData.screenshotUrl = finalScreenshotUrl.trim();

      await submitPayment(paymentData);

      setCurrentStep("complete");
      setTimeout(() => router.push("/appointments"), 3000);
    } catch (err: any) {
      setError(err.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Time slots 2am–5pm in 30-min increments (12-hour format)
  const timeSlots = Array.from({ length: 30 }, (_, i) => {
    const hour24 = Math.floor(i / 2) + 2; // Start at 2 AM
    const min = i % 2 === 0 ? "00" : "30";
    
    // Convert to 12-hour format
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
    const period = hour24 >= 12 ? "PM" : "AM";
    
    // Store in 24-hour format for backend
    const value24 = `${String(hour24).padStart(2, "0")}:${min}`;
    // Display in 12-hour format
    const display12 = `${hour12}:${min} ${period}`;
    
    return { value: value24, display: display12 };
  });

  const today = new Date().toISOString().split("T")[0];

  // ── Complete ─────────────────────────────────────────────────────────────
  if (currentStep === "complete") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Complete!</h1>
          <p className="text-slate-600 mb-4">
            Your appointment has been booked and payment submitted successfully.
          </p>
          <p className="text-sm text-slate-500">
            You&apos;ll be notified once the owner verifies your payment.
          </p>
          <p className="text-sm text-slate-400 mt-4">Redirecting to your appointments...</p>
        </div>
      </div>
    );
  }

  // ── Booking Form ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Book an Appointment</h1>

      <form onSubmit={handleBooking} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Service */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Scissors className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Choose a Service</h2>
          </div>
          {servicesLoading ? (
            <p className="text-center py-8 text-slate-500">Loading services...</p>
          ) : services.length === 0 ? (
            <p className="text-center py-8 text-slate-500">No services available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    selectedServiceId === service.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-slate-900">{service.name}</p>
                    <p className="text-blue-600 font-bold">{service.price} ETB</p>
                  </div>
                  <p className="text-xs text-slate-400">{service.durationMinutes} min</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Branch (optional) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Choose a Branch <span className="text-slate-400 font-normal text-sm">(optional)</span></h2>
          </div>
          {shopsLoading ? (
            <p className="text-center py-4 text-slate-500">Loading branches...</p>
          ) : shops.length === 0 ? (
            <p className="text-center py-4 text-slate-500">No branches available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shops.map((shop: any) => (
                <button
                  key={shop.id}
                  type="button"
                  onClick={() => {
                    setSelectedShopId(selectedShopId === shop.id ? null : shop.id);
                    setSelectedBarberId(null); // reset barber when branch changes
                  }}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    selectedShopId === shop.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <p className="font-medium text-slate-900">{shop.name}</p>
                  {shop.address && <p className="text-xs text-slate-500 mt-1">{shop.address}</p>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Barber */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Choose a Barber</h2>
          </div>
          {!selectedShopId ? (
            <p className="text-center py-4 text-slate-400 text-sm">Please select a branch first to see available barbers.</p>
          ) : barbersLoading ? (
            <p className="text-center py-4 text-slate-400 text-sm">Loading barbers...</p>
          ) : barbers.length === 0 ? (
            <p className="text-center py-4 text-slate-500">No barbers available at this branch.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {barbers.map((barber) => (
                <button
                  key={barber.barberId}
                  type="button"
                  onClick={() => setSelectedBarberId(barber.barberId)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    selectedBarberId === barber.barberId
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {barber.firstName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{barber.firstName} {barber.lastName}</p>
                      {barber.skills && <p className="text-xs text-slate-500">{barber.skills}</p>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Choose a Date</h2>
          </div>
          <input
            type="date"
            min={today}
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Time */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Choose a Time</h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.value}
                type="button"
                onClick={() => setTime(slot.value)}
                className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                  time === slot.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-slate-200 text-slate-700 hover:border-blue-300"
                }`}
              >
                {slot.display}
              </button>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Payment</h2>

          {/* Method */}
          <div className="space-y-2 mb-4">
            {Object.entries(PAYMENT_METHODS).map(([key, method]) => (
              <label key={key} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={key}
                  checked={paymentMethod === key}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="h-4 w-4"
                />
                <span className="font-medium text-sm">{method.name}</span>
              </label>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="font-semibold text-blue-900 text-sm mb-2">{PAYMENT_METHODS[paymentMethod].instructions}</p>
            <div className="flex items-center gap-2">
              <code className="bg-white px-3 py-1.5 rounded-lg text-sm flex-1 border border-blue-200">
                {PAYMENT_METHODS[paymentMethod].account}
              </code>
              <button type="button" onClick={handleCopyAccount}
                className="p-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                {copiedAccount ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-blue-600" />}
              </button>
            </div>
          </div>

          {/* Transaction ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Transaction ID {!screenshotFile && !screenshotUrl && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              placeholder="Enter your transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          {/* Screenshot */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Screenshot {!transactionId && <span className="text-red-500">*</span>}
            </label>
            <input type="file" id="screenshotFile" accept="image/*" onChange={handleFileChange} className="hidden" />
            <label htmlFor="screenshotFile"
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <Upload className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600">{screenshotFile ? "Change Image" : "Upload Screenshot"}</span>
            </label>

            {screenshotFile && (
              <div className="flex items-center gap-2 mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-green-800 flex-1 truncate">{screenshotFile.name}</span>
                <button type="button" onClick={() => setScreenshotFile(null)} className="text-green-600 hover:text-green-800">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {!screenshotFile && (
              <div className="mt-3">
                <div className="relative mb-3">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                  <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-slate-400">OR paste URL</span></div>
                </div>
                <input
                  type="text"
                  placeholder="https://..."
                  value={screenshotUrl}
                  onChange={(e) => setScreenshotUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {selectedService && selectedBarber && date && time && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <strong>{selectedService.name}</strong> ({selectedService.price} ETB) with{" "}
            <strong>{selectedBarber.firstName} {selectedBarber.lastName}</strong>
            {selectedShop && <> at <strong>{selectedShop.name}</strong></>} on{" "}
            <strong>{date}</strong> at <strong>{time}</strong>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Book & Pay
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}


export default function BookAppointmentPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-slate-600">Loading booking form...</p>
        </div>
      </div>
    }>
      <BookAppointmentContent />
    </Suspense>
  );
}
