"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { Inter } from "next/font/google";
import { User, LogOut, Settings, Calendar, LayoutDashboard, Users, Store, UserPlus, Menu, X, Sparkles, Scissors, Home } from "lucide-react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

function NavLinks() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  if (!user) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Login
          </Link>
          <Link href="/signup" className="text-sm bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
            Sign Up
          </Link>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg md:hidden p-4 space-y-2">
            <Link href="/login" className="block px-4 py-3 hover:bg-slate-50 rounded-lg font-medium">
              Login
            </Link>
            <Link href="/signup" className="block px-4 py-3 bg-blue-600 text-white rounded-lg font-medium text-center">
              Sign Up
            </Link>
          </div>
        )}
      </>
    );
  }

  const isOwner    = user.roles.includes("ROLE_OWNER");
  const isBarber   = user.roles.includes("ROLE_BARBER");
  const isCustomer = user.roles.includes("ROLE_CUSTOMER");

  const navItems = [];
  if (isOwner) {
    navItems.push({ href: "/", label: "Home", icon: Home });
    navItems.push({ href: "/owners/dashboard", label: "Dashboard", icon: LayoutDashboard });
    navItems.push({ href: "/owners/branches", label: "Branches", icon: Store });
    navItems.push({ href: "/owners/barbers", label: "Barbers", icon: UserPlus });
    navItems.push({ href: "/owners/services", label: "Services", icon: Scissors });
    navItems.push({ href: "/owners/payments", label: "Payments", icon: Calendar });
  }
  if (isBarber) navItems.push({ href: "/", label: "Home", icon: Home });
  if (isBarber) navItems.push({ href: "/barbers/dashboard", label: "My Schedule", icon: Calendar });
  if (isCustomer) {
    navItems.push({ href: "/", label: "Home", icon: Home });
    navItems.push({ href: "/appointments", label: "My Bookings", icon: Calendar });
    navItems.push({ href: "/appointments/book", label: "Book Now", icon: Calendar });
    navItems.push({ href: "/customers/hairstyle-recommendations", label: "Hairstyles", icon: Sparkles });
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        {navItems.map(item => (
          <Link 
            key={item.href} 
            href={item.href} 
            className="flex items-center gap-2 hover:text-blue-600 font-medium transition-colors text-sm"
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}

        {/* Profile Dropdown */}
        <div className="relative border-l pl-6">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user.username[0].toUpperCase()}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-slate-900">{user.username}</div>
              <div className="text-xs text-slate-500">
                {isOwner ? "Owner" : isBarber ? "Barber" : "Customer"}
              </div>
            </div>
          </button>

          {profileDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-20">
                {isCustomer && (
                  <Link 
                    href="/customers/profile/edit" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium">My Profile</span>
                  </Link>
                )}
                {isBarber && (
                  <Link 
                    href="/barbers/profile/edit" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium">My Profile</span>
                  </Link>
                )}
                {isOwner && (
                  <Link 
                    href="/owners/profile/edit" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium">My Profile</span>
                  </Link>
                )}
                <div className="border-t border-slate-100 my-2" />
                <button
                  onClick={() => {
                    logout();
                    setProfileDropdownOpen(false);
                    router.push('/');
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg md:hidden p-4 space-y-2 z-50">
          {navItems.map(item => (
            <Link 
              key={item.href}
              href={item.href} 
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
          <div className="border-t border-slate-100 my-2" />
          {isCustomer && (
            <Link 
              href="/customers/profile/edit" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              My Profile
            </Link>
          )}
          {isBarber && (
            <Link 
              href="/barbers/profile/edit" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              My Profile
            </Link>
          )}
          {isOwner && (
            <Link 
              href="/owners/profile/edit" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              My Profile
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              setMobileMenuOpen(false);
              router.push('/');
            }}
            className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg font-medium w-full text-left text-red-600"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <title>Ethio Barber - Premium Barbershop in Addis Ababa</title>
        <meta name="description" content="Book your appointment at Ethiopia's premier barbershop chain. Expert barbers, modern styles, and exceptional service in Addis Ababa." />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900">
        <QueryClientProvider client={queryClient}>
          <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900 hover:text-blue-600 transition-colors">
                <img src="/logo.svg" alt="Ethio Barber Logo" className="w-10 h-10" />
                Ethio<span className="text-blue-600">Barber</span>
              </Link>
              <NavLinks />
            </nav>
          </header>
          <main className="container mx-auto px-4 py-8">{children}</main>
          <footer className="bg-slate-900 text-white mt-16">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-2xl font-black mb-4">Ethio<span className="text-blue-400">Barber</span></h3>
                  <p className="text-slate-400 text-sm">
                    Ethiopia's premier barbershop chain serving Addis Ababa with excellence.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                    <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                    <li><Link href="/appointments/book" className="hover:text-white transition-colors">Book Appointment</Link></li>
                    <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
                    <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Locations</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>Bole Sub-City, Addis Ababa</li>
                    <li>Piassa, Arada Woreda</li>
                    <li>Kazanchis, Kirkos Woreda</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Contact</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>Phone: 0931798929</li>
                    <li>Email: info@ethiobarber.et</li>
                    <li>Hours: Mon-Sat, 9AM-8PM</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
                <p>&copy; 2024 Ethio Barbershop. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </QueryClientProvider>
      </body>
    </html>
  );
}
