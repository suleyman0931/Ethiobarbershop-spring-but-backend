"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Scissors, Calendar, Star, Clock, MapPin, Phone, Award, Users } from "lucide-react";
import { apiClient } from "@/lib/api";
import type { BarberResponse } from "@/modules/barber/types/barber.types";
import { useAuthStore } from "@/stores/auth.store";
import { WeatherWidget } from "@/components/weather/WeatherWidget";
import ImageGallery from "@/components/gallery/ImageGallery";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { BarberCardsWithRatings } from "@/components/barbers/BarberCardsWithRatings";

export default function Home() {
  const { user } = useAuthStore();
  const isCustomer = user?.roles.includes("ROLE_CUSTOMER");
  const isGuest = !user; // User is not logged in

  const { data: barbers = [], isLoading } = useQuery({
    queryKey: ["barbers"],
    queryFn: () => apiClient.get<BarberResponse[]>("/barbers"),
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => apiClient.get<any[]>("/services/active"),
  });

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section with Background */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-10 lg:p-20 min-h-[500px] flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Weather Widget - Top Right */}
        <div className="absolute top-6 right-6 z-20 hidden lg:block">
          <WeatherWidget />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-block bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 mb-6">
            <span className="text-blue-300 text-sm font-semibold">🇪🇹 Ethiopia's Premier Barbershop</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
            Ethio<br />
            <span className="text-blue-400">Barbershop</span>
          </h1>
          <p className="text-slate-300 text-xl mb-8 leading-relaxed">
            Experience premium grooming services in the heart of Addis Ababa. 
            Book your appointment with our expert barbers — no waiting in line.
          </p>
          
          {/* Weather Widget - Mobile (below text) */}
          <div className="mb-6 lg:hidden">
            <WeatherWidget />
          </div>

          {isCustomer ? (
            <Link href="/appointments/book"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl">
              <Calendar className="w-5 h-5" />
              Book Appointment
            </Link>
          ) : !user ? (
            <div className="flex gap-4">
              <Link href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
                Get Started
              </Link>
              <Link href="/login"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-bold transition-all border border-white/20">
                Login
              </Link>
            </div>
          ) : null}
        </div>

        {/* Decorative Elements */}
        <Scissors className="absolute right-12 top-12 w-40 h-40 text-white/5 rotate-12" />
        <Scissors className="absolute left-12 bottom-12 w-24 h-24 text-white/5 -rotate-45" />
      </section>

      {/* About Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-6">
            Welcome to Ethio Barbershop
          </h2>
          <p className="text-slate-600 text-lg mb-6 leading-relaxed">
            Located in the vibrant heart of Addis Ababa, Ethio Barbershop has been serving the community 
            with exceptional grooming services. Our skilled barbers combine traditional Ethiopian hospitality 
            with modern styling techniques to give you the perfect look.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Multiple Locations</h3>
                <p className="text-slate-600 text-sm">Bole, Piassa, and Kazanchis — serving all of Addis Ababa</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Expert Barbers</h3>
                <p className="text-slate-600 text-sm">Certified professionals with years of experience</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Trusted by Thousands</h3>
                <p className="text-slate-600 text-sm">Join our community of satisfied customers</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center overflow-hidden">
            <Scissors className="w-64 h-64 text-slate-300" />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <div className="font-black text-2xl text-slate-900">4.9/5</div>
                <div className="text-sm text-slate-500">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <ImageGallery />

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Features */}
      <section>
        <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              icon: Calendar, 
              title: "Easy Online Booking", 
              desc: "Pick your preferred barber and time slot in seconds. No phone calls needed.",
              color: "text-blue-600",
              bg: "bg-blue-50"
            },
            { 
              icon: Star, 
              title: "Expert Barbers", 
              desc: "Skilled professionals trained in both traditional and modern styling techniques.",
              color: "text-yellow-600",
              bg: "bg-yellow-50"
            },
            { 
              icon: Clock, 
              title: "No Waiting Time", 
              desc: "Your time slot is reserved exclusively for you. Just show up and get groomed.",
              color: "text-green-600",
              bg: "bg-green-50"
            },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 hover:shadow-lg transition-shadow">
              <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-6`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">{title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-slate-900 rounded-3xl p-10 lg:p-16 text-white">
        <h2 className="text-3xl font-black mb-4 text-center">Our Services</h2>
        <p className="text-slate-300 text-center mb-12 max-w-2xl mx-auto">
          From classic cuts to modern styles, we offer a full range of grooming services
        </p>
        
        {servicesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-pulse">
                <div className="h-5 bg-white/20 rounded w-3/4 mb-2" />
                <div className="h-6 bg-white/20 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Scissors className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
                <h3 className="font-bold mb-2">{service.name}</h3>
                <p className="text-blue-400 font-bold text-lg">{service.price} ETB</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Barbers Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Meet Our Barbers</h2>
            <p className="text-slate-600 mt-2">Experienced professionals ready to serve you</p>
          </div>
          {isCustomer && (
            <Link href="/appointments/book" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
              Book Now <span>→</span>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                <div className="w-20 h-20 bg-slate-200 rounded-full mb-4" />
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : barbers.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl">
            <Scissors className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No barbers available yet. Check back soon!</p>
          </div>
        ) : (
          <BarberCardsWithRatings barbers={barbers} isCustomer={isCustomer} isGuest={isGuest} />
        )}
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-10 lg:p-16 text-white text-center">
          <h2 className="text-4xl font-black mb-4">Ready for a Fresh Look?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers. Book your appointment today and experience the best grooming in Addis Ababa.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup"
              className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
              Sign Up Now
            </Link>
            <Link href="/login"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-bold transition-all border border-white/20">
              Login
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
