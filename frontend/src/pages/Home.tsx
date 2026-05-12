import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ShieldCheck, Zap, Headphones, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-blue-700 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-blue-700 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Start Your Own</span>{' '}
                  <span className="block text-blue-200 xl:inline">Bulk SMS Business</span>
                </h1>
                <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Join India's most trusted Bulk SMS Reseller Program. Professional white-label platform, best-in-class pricing, and 24/7 support.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#pricing"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 md:py-4 md:text-lg md:px-10"
                    >
                      View Pricing
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
            alt="Productivity"
          />
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">White Label Panel</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Launch with your own brand name and logo. Your clients will never know about us.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Zap className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">High Speed Delivery</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Multiple operator connectivity ensures instant delivery for all your transactional and promo SMS.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Headphones className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Expert Support</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Dedicated account manager and technical support available 24/7 to help your business grow.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:text-center lg:text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Pricing Plans</h2>
            <p className="mt-4 text-lg text-gray-600">Choose the best plan for your business needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-sm flex flex-col transition-all hover:shadow-md">
              <h3 className="text-xl font-bold text-gray-900">Starter</h3>
              <p className="text-4xl font-extrabold mt-4 text-blue-600">₹ 5,000</p>
              <p className="text-gray-500 mt-2">50,000 SMS Credits</p>
              <ul className="mt-6 space-y-4 flex-grow">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  White Label Panel
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  API Access
                </li>
              </ul>
              <Link to="/register" className="mt-8 block w-full text-center py-3 px-4 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">Select Plan</Link>
            </div>
            <div className="bg-white p-8 border-2 border-blue-500 rounded-2xl shadow-lg flex flex-col relative transform scale-105">
              <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">MOST POPULAR</span>
              <h3 className="text-xl font-bold text-gray-900">Professional</h3>
              <p className="text-4xl font-extrabold mt-4 text-blue-600">₹ 15,000</p>
              <p className="text-gray-500 mt-2">2,00,000 SMS Credits</p>
              <ul className="mt-6 space-y-4 flex-grow">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Everything in Starter
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Priority Support
                </li>
              </ul>
              <Link to="/register" className="mt-8 block w-full text-center py-3 px-4 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">Select Plan</Link>
            </div>
            <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-sm flex flex-col transition-all hover:shadow-md">
              <h3 className="text-xl font-bold text-gray-900">Enterprise</h3>
              <p className="text-4xl font-extrabold mt-4 text-blue-600">₹ 50,000</p>
              <p className="text-gray-500 mt-2">10,00,000 SMS Credits</p>
              <ul className="mt-6 space-y-4 flex-grow">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Custom Integration
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Unlimited Resellers
                </li>
              </ul>
              <Link to="/register" className="mt-8 block w-full text-center py-3 px-4 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">Select Plan</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SMSHub</h3>
            <p className="text-gray-400">Your partner in bulk messaging solutions since 2018.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Bulk SMS</li>
              <li>OTP Services</li>
              <li>API Integration</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-gray-400">support@smshub.example.com</p>
            <p className="text-gray-400">+91 123 456 7890</p>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm border-t border-gray-700 pt-8">
          &copy; 2026 SMSHub Technologies. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
