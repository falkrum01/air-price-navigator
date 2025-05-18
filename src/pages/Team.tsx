
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, User } from "lucide-react";

const Team = () => {
  const teamMembers = [
    {
      name: "Ashwin",
      description: "Full Stack Developer",
      image: "https://res.cloudinary.com/dbt3gghme/image/upload/v1747567818/Professional_Black_Blazer_with_BG_utbbrh.jpg",
      linkedin: "https://www.linkedin.com/in/ashwin-reddy-1580/"
    },
    {
      name: "Karthik",
      description: "UI/UX Developer",
      image: "https://res.cloudinary.com/dbt3gghme/image/upload/v1747567767/PHOTO-2025-05-18-16-23-23_qramt9.jpg",
      linkedin: "https://www.linkedin.com/in/bkarthik5105/"
    },
    {
      name: "Mohammed Sohail",
      description: "Backend Developer",
      image: "https://res.cloudinary.com/dbt3gghme/image/upload/v1747108557/IMG_3460_xrszov.jpg",
      linkedin: "https://www.linkedin.com/in/mohammed-sohail-82176825b/"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Team</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 px-2 sm:px-0">
            Developed by students from Ellenki College Of Engineering and Technology 
            under the supervision of the ExcelR project management team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 mt-6">
            <a 
              href="https://ellenkicet.ac.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80 transition-opacity w-full sm:w-auto px-4 py-3 sm:p-0"
            >
              <div className="flex items-center justify-center bg-white rounded-lg p-3 sm:p-0 sm:bg-transparent w-full sm:w-auto">
                <img 
                  src="https://res.cloudinary.com/dbt3gghme/image/upload/b_rgb:FFFFFF/c_pad,w_80,h_80/v1747570084/ECET_Logo_wrj2lb.png" 
                  alt="Ellenki College of Engineering & Technology" 
                  className="h-16 sm:h-20 w-auto object-contain" 
                />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">Ellenki College of Engineering & Technology</p>
            </a>
            <a 
              href="https://www.excelr.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80 transition-opacity w-full sm:w-auto px-4 py-3 sm:p-0"
            >
              <div className="flex items-center justify-center bg-white rounded-lg p-3 sm:p-0 sm:bg-transparent w-full sm:w-auto">
                <img 
                  src="https://res.cloudinary.com/dbt3gghme/image/upload/c_pad,b_gen_fill,w_80,h_80/v1747570419/download_yqernn.png" 
                  alt="ExcelR Solutions" 
                  className="h-16 sm:h-20 w-auto object-contain" 
                />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">ExcelR Solutions</p>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 sm:mb-16">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg h-full">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center h-full">
                <div className="rounded-full overflow-hidden w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  ) : (
                    <div className="bg-muted rounded-full p-3 sm:p-4 w-full h-full flex items-center justify-center">
                      <User className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">{member.description}</p>
                <div className="mt-auto">
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-muted p-2 hover:bg-muted/80 transition-colors"
                    aria-label={`${member.name}'s LinkedIn profile`}
                  >
                    <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted p-6 sm:p-8 rounded-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-center">Project Supervision</h2>
          <p className="text-sm sm:text-base text-center text-muted-foreground">
            This project was developed under the expert guidance and supervision of the ExcelR project management team,
            who provided valuable insights and direction throughout the development process.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Team;
