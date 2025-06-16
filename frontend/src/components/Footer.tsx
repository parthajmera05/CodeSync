import logo from "../../public/logo.png";
import Image from "next/image";

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  return (
    <footer className="w-full py-4 bg-black border-t border-white/[0.2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center ">
        <div
          onClick={() => scrollToSection("home")}
          className="flex gap-4 items-center justify-center"
        >
         
          <p className="font-spacegrotesksemibold text-white text-2xl cursor-pointer">
            Created with ❤️ by <a href="" className="text-orange-500">Parth Ajmera</a>
          </p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
