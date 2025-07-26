import React from "react";
import Header from "@/components/homepage/Header";
import Footer from "@/components/homepage/Footer";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-[350px] sm:h-[450px] lg:h-[550px] flex items-center justify-center bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/homepage/aboutbg2.jpg')" }}
      >
        {/* Dark Overlay with Blur Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60 "></div>

        {/* Content Container */}
        <div className="relative z-10 text-center px-6">
          {/* Animated Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-wide uppercase transition-all duration-500 hover:scale-105">
            Get in Touch
          </h1>

          {/* Tagline */}
          <p className="mt-3 text-lg sm:text-xl xl:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
            <span className="text-blue-400 font-semibold">
              We'd love to hear from you!
            </span>
            Reach out for any{" "}
            <span className="text-yellow-400 font-semibold">inquiries</span> or{" "}
            <span className="text-green-400 font-semibold">collaborations</span>
            .
          </p>
        </div>
      </section>

      {/* Contact Details */}
      <section className="container mx-auto px-3 md:px-6 py-4 md:py-10">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Office Addresses */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Offices
            </h2>
            <div className="space-y-6">
              {/* Corporate Office */}
              <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-xl text-green-700">
                Registered Office
                </h3>
                <p className="mt-2 text-gray-700">
                Address - Hore Chandra nagar.<br></br> DTR P9 Noel School Gird Gwalior Fort Gwalior 
                Pin code - 474008
                </p>
              </div>

            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Contact Information
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <p className="text-gray-700">
                <strong>Phone:</strong> +91 8905895913
                <br />
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:support@yourwebsite.com"
                  className="text-blue-600 hover:underline"
                >
                  support@yourwebsite.com
                </a>
                <br />
                <strong>Website:</strong>{" "}
                <a
                  href="https://www.yourwebsite.com"
                  className="text-blue-600 hover:underline"
                >
                  www.yourwebsite.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Sections */}
      {/* <section className="container mx-auto px-3 md:px-6 py-4 md:py-10">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Support & Assistance
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Customer Care",
              phone: "+91 98765 43210 / +91 87654 32109",
              email: "support@yourwebsite.com",
            },
            {
              title: "Billing Inquiries",
              phone: "+91 91234 56789",
              email: "billing@yourwebsite.com",
            },
            {
              title: "Technical Support",
              phone: "+91 92345 67890",
              email: "techsupport@yourwebsite.com",
            },
            {
              title: "Refunds & Payments",
              phone: "+91 93456 78901",
              email: "payments@yourwebsite.com",
            },
            {
              title: "Logistics & Delivery",
              phone: "+91 94567 89012",
              email: "logistics@yourwebsite.com",
            },
            {
              title: "Account Management",
              phone: "+91 95678 90123",
              email: "accounts@yourwebsite.com",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-gray-500"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-700 mt-2">
                <strong>Phone:</strong> {item.phone}
                <br />
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${item.email}`}
                  className="text-gray-600 hover:underline"
                >
                  {item.email}
                </a>
              </p>
            </div>
          ))}
        </div>
      </section> */}

      {/* Google Map */}
      <section className="container mx-auto px-3 md:px-6 py-4 md:py-10">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Find Us
        </h2>
        <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
          <iframe
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.4333146271097!2d78.15578385555166!3d26.23440379237345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c68aabbc82db%3A0x390b90996a17f180!2sNoel%20Public%20School!5e0!3m2!1sen!2sin!4v1744795761143!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* Sign Up Button */}
      <section className="container mx-auto px-3 md:px-6 py-4 md:py-10 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Us Today</h2>
        <p className="text-gray-700 mb-6">
          Become a part of our community and explore amazing opportunities.
        </p>
        <Link href="/signup">
          <button className="px-6 py-3 text-lg font-semibold bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all">
            Sign Up Now
          </button>
        </Link>
      </section>

      <Footer />
    </>
  );
}
