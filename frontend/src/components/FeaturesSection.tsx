"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Feature1 from "../../public/img2.png";
import Feature2 from "../../public/Screenshot 2024-12-01 015641.png";
import Feature3 from "../../public/img3.png";

const FeaturesSection = () => {
  const features = [
    {
      icon: "🌐",
      title: "Real-Time Collaborative Coding",
      description:
        "Work together on code with live updates across multiple languages. With 20+ themes to choose from, every coder feels at home.",
      image: Feature1,
      color: "bg-black",
    },
    {
      icon: "💬",
      title: "Built-in Communication",
      description:
        "Integrated chat and video calls keep your team in sync. Share styled code snippets or download files effortlessly.",
      image: Feature2,
      color: "bg-black",
    },
    {
      icon: "⚡",
      title: "Smart AI Coding Assistant",
      description:
        "Genie helps you code smarter with intelligent suggestions, auto-fixes, and instant help when you need it most.",
      image: Feature3,
      color: "bg-black",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = (fromLeft: boolean) => ({
    hidden: {
      opacity: 0,
      x: fromLeft ? -100 : 100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  });

  return (
    <motion.div
      className="container lg:w-[80vw] mx-auto px-4 lg:py-12 md:py-10 py-6 font-spacegroteskmedium"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          className={`flex flex-col md:flex-row items-center mb-16 rounded-2xl overflow-hidden shadow-md ${feature.color} ${
            index % 2 === 1 ? "md:flex-row-reverse" : ""
          }`}
          variants={containerVariants}
        >
          <motion.div
            className="md:w-1/2 p-8"
            variants={itemVariants(index % 2 === 0)}
          >
            <div className="text-5xl mb-4 text-center md:text-start">
              {feature.icon}
            </div>
            <h2 className="lg:text-3xl text-xl font-bold font-spacegroteskregular mb-4 text-center md:text-start bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
              {feature.title}
            </h2>
            <p className="text-white text-md lg:text-lg font-spacegrotesklight leading-relaxed text-center md:text-start">
              {feature.description}
            </p>
          </motion.div>
          <motion.div
            className="md:w-1/2 lg:p-8 md:p-8 p-4"
            variants={itemVariants(index % 2 === 1)}
          >
            <Image
              src={feature.image}
              alt={feature.title}
              className="w-full h-auto rounded-2xl shadow-xl transform transition-transform duration-300 hover:scale-105"
            />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeaturesSection;
