// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import FarmingAnimation from '../components/FarmingAnimation';
import AnimatedShapes from '../components/AnimatedShapes';
import WaveDivider from '../components/WaveDivider';
import { 
  Sprout, 
  DollarSign, 
  Radio, 
  Phone, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Award, 
  Globe,
  CheckCircle
} from 'lucide-react';

// Typewriter Effect Component
const TypewriterText = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, delay = 0, link }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="group"
    >
      <Link to={link} className="block">
        <div className="bg-white rounded-2xl shadow-lg p-8 h-full transition-all duration-300 hover:shadow-2xl border border-green-100">
          <div className="w-16 h-16 bg-gradient-to-br from-[#65CCB8] to-[#4DB8A1] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
          <div className="mt-6 flex items-center text-[#65CCB8] font-semibold group-hover:gap-3 transition-all">
            Learn More
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, value, label, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 text-center hover:bg-white/20 transition-all border border-white/20"
    >
      <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
        <Icon className="w-7 h-7 text-[#65CCB8]" />
      </div>
      <h3 className="text-4xl font-bold text-white mb-2">{value}</h3>
      <p className="text-white/90 font-medium">{label}</p>
    </motion.div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ name, location, quote, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-[#FAFAFA] rounded-xl shadow-md p-6 border-l-4 border-[#65CCB8]"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#65CCB8] to-[#4DB8A1] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">{name[0]}</span>
        </div>
        <div className="ml-4">
          <h4 className="font-bold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-600">{location}</p>
        </div>
      </div>
      <p className="text-gray-700 italic leading-relaxed">"{quote}"</p>
      <div className="flex mt-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-lg">★</span>
        ))}
      </div>
    </motion.div>
  );
};

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <div className="w-full overflow-x-hidden relative">
      {/* Farming Animation */}
      <FarmingAnimation />
      
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity, y }}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#65CCB8] via-[#4DB8A1] to-[#65CCB8] overflow-hidden"
      >
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80)'
          }}
        />
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <Sprout className="w-12 h-12 text-green-600" />
              </div>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <TypewriterText text="Empowering Farmers with AI" speed={100} />
            </h1>
            
            <p className="text-xl sm:text-2xl text-green-50 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionize your farming with AI-powered insights, smart crop recommendations, and real-time monitoring.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-3 bg-white text-[#65CCB8] px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-[#FFD86A] hover:text-white hover:scale-105 transition-all duration-300"
              >
                Get Started
                <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm">Scroll Down</span>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-white rounded-full mt-2"
              />
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful AI-driven tools designed specifically for modern farmers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Sprout}
              title="🌾 Crop Recommendation"
              description="Get personalized crop suggestions based on your soil analysis, weather patterns, and market trends. AI-powered recommendations ensure optimal yield."
              delay={0.1}
              link="/crop-recommendation"
            />
            <FeatureCard
              icon={DollarSign}
              title="💧 Fertilizer & Profit Analysis"
              description="Optimize fertilizer usage and maximize profits with intelligent cost-benefit analysis and price prediction algorithms."
              delay={0.2}
              link="/fertilizer-profit"
            />
            <FeatureCard
              icon={Radio}
              title="📡 IoT Monitoring"
              description="Monitor your fields in real-time with IoT sensors. Track soil moisture, temperature, humidity, and more from anywhere."
              delay={0.3}
              link="/iot-monitoring"
            />
            <FeatureCard
              icon={Phone}
              title="🎙️ Voice Buddy Assistant"
              description="Get instant answers and guidance through voice commands. Your AI assistant is available 24/7 to help with farming queries."
              delay={0.4}
              link="/voice-buddy"
            />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-[#65CCB8] to-[#4DB8A1] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted by Farmers Nationwide
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Real results from real farmers
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              value="10K+"
              label="Farmers Helped"
              delay={0.1}
            />
            <StatCard
              icon={Award}
              value="95%"
              label="Accuracy Rate"
              delay={0.2}
            />
            <StatCard
              icon={TrendingUp}
              value="30%"
              label="Yield Increase"
              delay={0.3}
            />
            <StatCard
              icon={Globe}
              value="50+"
              label="Regions Covered"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              What Farmers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from our community of successful farmers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Rajesh Kumar"
              location="Nashik, Maharashtra"
              quote="Crop Mentor transformed my farming. The AI recommendations helped me increase my yield by 35% and reduced my fertilizer costs significantly. This is the future of farming!"
              delay={0.1}
            />
            <TestimonialCard
              name="Priya Sharma"
              location="Punjab"
              quote="The IoT monitoring feature is a game-changer. I can now monitor my fields from my phone and get alerts about soil moisture and weather conditions. Absolutely incredible technology!"
              delay={0.2}
            />
            <TestimonialCard
              name="Kiran Reddy"
              location="Andhra Pradesh"
              quote="Voice Buddy has been my constant companion. I can ask questions anytime, and it gives me expert advice. The fertilizer analysis helped me save thousands while improving quality."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#65CCB8] via-[#86D9B8] to-[#A8FFCE] overflow-hidden">
        {/* Animated Background Shapes */}
        <AnimatedShapes />
        
        {/* Wave Divider */}
        <WaveDivider />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-2xl mx-auto font-medium">
              Join thousands of farmers who are already using AI to make smarter decisions and boost their yields.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/dashboard"
                className="relative inline-flex items-center gap-3 bg-gradient-to-r from-white to-white text-[#65CCB8] px-12 py-6 rounded-full font-bold text-xl shadow-2xl hover:shadow-white/50 transition-all duration-500 overflow-hidden group"
              >
                {/* Animated Gradient Background on Hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#FFD86A] via-[#FFCC33] to-[#FFD86A] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    backgroundSize: '200% 100%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '200% 0%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'linear'
                  }}
                />
                <span className="relative z-10 text-[#65CCB8] group-hover:text-white transition-colors duration-300">
                  Start Free Trial
                </span>
                <ArrowRight className="w-6 h-6 relative z-10 text-[#65CCB8] group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

