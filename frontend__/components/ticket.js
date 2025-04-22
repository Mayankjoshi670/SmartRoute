"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'dd MMM yyyy'));
  const [currentTime, setCurrentTime] = useState('');
  const [bookingData, setBookingData] = useState({
    username: 'JOHN DOE',
    vehicleNumber: 'UK04289734',
    vehicleType: '4 wheeler',
    timeSlot: '9:00 AM - 10:00 AM',
    dateOfTravel: format(new Date(), 'dd MMM yyyy')
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <Head>
        <title>SmartRoute - Vehicle Booking</title>
        <meta name="description" content="SmartRoute vehicle booking system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl font-bold text-white"
          >
            SmartRoute
          </motion.h1>
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl text-gray-300 font-mono"
          >
            {currentTime}
          </motion.div>
        </div>

        <motion.div 
          className="bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden shadow-xl"
          whileHover={{ 
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
            scale: 1.01 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gray-800 p-6">
            <motion.h2 
              className="text-3xl font-bold text-center text-white"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              SmartRoute
            </motion.h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              {[
                { label: "username :", value: bookingData.username },
                { label: "vehicle number:", value: bookingData.vehicleNumber },
                { label: "Vehicle type:", value: bookingData.vehicleType },
                { label: "Time :", value: bookingData.timeSlot },
                { label: "Date of travel:", value: bookingData.dateOfTravel },
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                >
                  <div>
                    <div className="text-gray-400 font-medium mb-1">{item.label}</div>
                    <div className="text-xl text-white font-bold">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div 
          className="mt-8 flex justify-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <motion.button 
            className="px-8 py-3 rounded-xl bg-blue-600 text-white font-medium text-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Start Journey
          </motion.button>
        </motion.div>
        <motion.div 
          className="mt-8 bg-gray-800 rounded-xl p-4 border border-gray-700"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse mr-2"></div>
            <div className="text-gray-300">
              Your vehicle is ready for journey. Please arrive 10 minutes before your scheduled time.
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}