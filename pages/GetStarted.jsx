
import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Handshake, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const GetStarted = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      <Link to="/" className="inline-flex items-center text-white hover:text-blue-100 font-bold group transition-colors">
        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-white">How can we help you today?</h1>
        <p className="text-blue-50 text-xl font-medium">Do you want to learn a skill or help others with your skills?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          whileHover={{ y: -8 }}
          className="flex">
          
          <Link to="/request-help" className="flex-1 group bg-white shadow-2xl p-10 rounded-[3rem] border border-blue-100 text-center space-y-6 transition-all duration-300">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <HelpCircle size={48} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-blue-900">I need help</h2>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                Do you have a problem? Post a task and use your time balance to get help from others.
              </p>
            </div>
            <div className="inline-block bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-blue-100 group-hover:bg-blue-700 transition-colors">
              Post a Task
            </div>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -8 }}
          className="flex">
          
          <Link to="/offer-help" className="flex-1 group bg-white shadow-2xl p-10 rounded-[3rem] border border-blue-100 text-center space-y-6 transition-all duration-300">
            <div className="w-24 h-24 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xl shadow-blue-200">
              <Handshake size={48} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-blue-900">I want to help</h2>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                Can you do something well? Help people, earn hours, and build your profile reputation.
              </p>
            </div>
            <div className="inline-block bg-blue-800 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-blue-200 group-hover:bg-blue-900 transition-colors">
              Share Skills
            </div>
          </Link>
        </motion.div>
      </div>
    </div>);

};

export default GetStarted;