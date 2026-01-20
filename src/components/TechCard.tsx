import React from "react";
import Glass from "./liquidglass/LiquidGlassCard";
import {
    Home,
    Instagram,
    Linkedin,
    Github,
    Calendar,
    Image,
    Info,
    Phone,
    ShieldCheck,
} from "lucide-react";


function TechCard() {
    return (
        <div className="flex gap-50">
            <div className="flex items-center justify-center   bg-[#1a1a1a]">
                <div className="relative w-[250px] h-[380px] rounded-3xl overflow-hidden bg-[#333] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">


                    <img
                        src="https://media.licdn.com/dms/image/v2/D5603AQH87_4Li9AV2g/profile-displayphoto-crop_800_800/B56Zpe024wG4AI-/0/1762527506548?e=1770249600&v=beta&t=M8I9y1etPfbnp3QFYyAy84xbceDc1onZuhMNioTfkGU"
                        alt="shisir karkera"
                        className="w-full h-full object-cover"
                    />


                    <div
                        className="
            absolute bottom-0 left-0 w-full h-[60%]
            flex flex-col justify-end p-6 text-white
            bg-linear-to-b
            from-[rgba(47,24,94,0,0.2)]
            via-[#2c106496]
            to-[rgb(66,40,118)]
          "
                    >

                        <h2 className="text-2xl font-bold mb-2">Shishir Karkera</h2>


                        <p className="text-[15px] leading-snug text-gray-200 mb-6">
                            Aaj kamayega, kal khayega. Haan meri jaan
                        </p>


                        <div className="flex justify-end gap-2">
                            <Glass className="rounded-full hover:animate-pulse flex justify-center items-center"><Linkedin className="w-6" /></Glass>
                            <Glass className="rounded-full hover:animate-pulse flex justify-center items-center"><Instagram className="w-6" /></Glass>
                            <Glass className="rounded-full hover:animate-pulse flex justify-center items-center"><Github className="w-6" /></Glass>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center   bg-[#1a1a1a]">
                <div className="relative w-[250px] h-[380px] rounded-3xl overflow-hidden bg-[#333] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">


                    <img
                        src="https://media.licdn.com/dms/image/v2/D5603AQH87_4Li9AV2g/profile-displayphoto-crop_800_800/B56Zpe024wG4AI-/0/1762527506548?e=1770249600&v=beta&t=M8I9y1etPfbnp3QFYyAy84xbceDc1onZuhMNioTfkGU"
                        alt="shisir karkera"
                        className="w-full h-full object-cover"
                    />


                    <div
                        className="
            absolute bottom-0 left-0 w-full h-[60%]
            flex flex-col justify-end p-6 text-white
            bg-linear-to-b
            from-[rgba(47,24,94,0,0.2)]
            via-[#2c106496]
            to-[rgb(66,40,118)]
          "
                    >

                        <h2 className="text-2xl font-bold mb-2">Shishir Karkera</h2>


                        <p className="text-[15px] leading-snug text-gray-200 mb-6">
                            Aaj kamayega, kal khayega. Haan meri jaan
                        </p>


                        <div className="flex justify-end gap-2">
                            <Glass className="rounded-full hover:animate-pulse flex justify-center items-center"><Linkedin /></Glass>
                            <Glass className="rounded-full hover:animate-pulse flex justify-center items-center"><Instagram /></Glass>
                            <Glass className="rounded-full hover:animate-pulse flex justify-center items-center"><Github /></Glass>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechCard;