"use client";

import { Mail, Phone, Code, Scissors, Users, MapPin, Award, Clock } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-slate-900 mb-4">
          About <span className="text-blue-600">Ethio Barber</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Ethiopia's premier barbershop management platform, connecting customers with expert barbers across Addis Ababa
        </p>
      </div>

      {/* About Ethio Barber */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-12 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Scissors className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-slate-900">Our Story</h2>
        </div>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            Ethio Barber is a modern barbershop booking platform designed to revolutionize the grooming experience in Ethiopia. 
            We connect customers with skilled barbers across multiple branches in Addis Ababa, making it easy to book appointments, 
            choose your preferred barber, and manage your grooming schedule.
          </p>
          
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            Our platform streamlines the entire barbershop experience - from browsing popular hairstyles and booking appointments 
            to secure payment processing and real-time appointment management. Whether you're a customer looking for a fresh cut, 
            a barber managing your schedule, or an owner running multiple branches, Ethio Barber provides the tools you need.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">Expert Barbers</h3>
            <p className="text-sm text-slate-600">Skilled professionals with years of experience</p>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <MapPin className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">Multiple Branches</h3>
            <p className="text-sm text-slate-600">Convenient locations across Addis Ababa</p>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <Clock className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">Easy Booking</h3>
            <p className="text-sm text-slate-600">Book appointments online anytime, anywhere</p>
          </div>
          
          <div className="text-center p-6 bg-orange-50 rounded-xl">
            <Award className="w-10 h-10 text-orange-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">Quality Service</h3>
            <p className="text-sm text-slate-600">Premium grooming experience guaranteed</p>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Code className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Developer</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Developer Info */}
          <div>
            <h3 className="text-2xl font-bold mb-2">Suleyman Abdu Mohammed</h3>
            <p className="text-blue-100 mb-6">Full Stack Developer</p>
            
            <p className="text-blue-50 mb-6 leading-relaxed">
              Passionate software developer dedicated to creating innovative solutions that solve real-world problems. 
              Ethio Barber was built with modern technologies to provide a seamless experience for barbershops and their customers.
            </p>

            <div className="space-y-3">
              <a 
                href="tel:+251931798929"
                className="flex items-center gap-3 text-white hover:text-blue-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-blue-200">Phone</div>
                  <div className="font-semibold">+251 931 798 929</div>
                </div>
              </a>

              <a 
                href="mailto:suleymanabdu0931@gmail.com"
                className="flex items-center gap-3 text-white hover:text-blue-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-blue-200">Email</div>
                  <div className="font-semibold">suleymanabdu0931@gmail.com</div>
                </div>
              </a>
            </div>
          </div>

          {/* Developer Image Placeholder */}
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/20">
              <div className="text-center">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-16 h-16 text-white" />
                </div>
                <p className="text-sm text-blue-100">Developer Photo</p>
                <p className="text-xs text-blue-200 mt-1">Add your photo here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to get started?</h3>
        <p className="text-slate-600 mb-6">Book your appointment today and experience the difference</p>
        <Link 
          href="/appointments/book"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
        >
          <Scissors className="w-5 h-5" />
          Book Now
        </Link>
      </div>
    </div>
  );
}
