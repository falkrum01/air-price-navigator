
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Code, User } from "lucide-react";

const Team = () => {
  const teamMembers = [
    {
      name: "Ashwin",
      role: "Developer",
      description: "Full Stack Developer"
    },
    {
      name: "Karthik",
      role: "Developer",
      description: "UI/UX Developer"
    },
    {
      name: "Mohammed Sohail",
      role: "Developer",
      description: "Backend Developer"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Our Team</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Developed by students from Ellenki College Of Engineering and Technology 
            under the supervision of the ExcelR project management team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-muted rounded-full p-4 mb-4">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                <p className="text-sm mb-6">{member.description}</p>
                <div className="flex space-x-3">
                  <button className="rounded-full bg-muted p-2 hover:bg-muted/80">
                    <Github className="h-5 w-5" />
                  </button>
                  <button className="rounded-full bg-muted p-2 hover:bg-muted/80">
                    <Linkedin className="h-5 w-5" />
                  </button>
                  <button className="rounded-full bg-muted p-2 hover:bg-muted/80">
                    <Code className="h-5 w-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">Project Supervision</h2>
          <p className="text-center text-muted-foreground">
            This project was developed under the expert guidance and supervision of the ExcelR project management team,
            who provided valuable insights and direction throughout the development process.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Team;
