import { useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

// SVG icons for services
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const ResourcesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
    <circle cx="10" cy="12" r="1"></circle>
  </svg>
);

const UtilitiesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

const CommunityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

// Service card data
const services = [
  {
    title: "Development Experience",
    description: "Gain hands-on experience building full-stack web applications in a collaborative environment.",
    icon: <CodeIcon />,
    detailedDescription: "Enhance your coding skills by contributing to real projects. Learn modern frameworks, version control, and deployment workflows guided by experienced mentors.",
    bgGradient: "from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200",
    iconBg: "bg-blue-100 text-blue-600",
    borderGradient: "border-blue-200"
  },
  {
    title: "Learning Resources",
    description: "Access curated learning materials and tutorials to enhance your tech skills.",
    icon: <ResourcesIcon />,
    detailedDescription: "Structured learning paths, video tutorials, and documentation covering frontend, backend, database design, and deployment strategies.",
    bgGradient: "from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200",
    iconBg: "bg-purple-100 text-purple-600",
    borderGradient: "border-purple-200"
  },
  {
    title: "Student Utilities",
    description: "Streamlined tools for academic management, scheduling, and study resources.",
    icon: <UtilitiesIcon />,
    detailedDescription: "Course planners, attendance trackers, study group coordinators, and resource finders designed specifically for NITRA Technical Campus students.",
    bgGradient: "from-green-50 to-green-100 hover:from-green-100 hover:to-green-200",
    iconBg: "bg-green-100 text-green-600",
    borderGradient: "border-green-200"
  },
  {
    title: "Community Engagement",
    description: "Connect with fellow students and tech enthusiasts through events and forums.",
    icon: <CommunityIcon />,
    detailedDescription: "Participate in hackathons, workshops, tech talks, and discussion forums. Build your network and collaborate on projects with like-minded peers.",
    bgGradient: "from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200",
    iconBg: "bg-amber-100 text-amber-600",
    borderGradient: "border-amber-200"
  }
];

const ServiceCard = ({ service }: { service: typeof services[0] }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate loading state for demo purposes
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className={`border overflow-hidden transition-all duration-300 bg-gradient-to-br ${service.bgGradient} border-${service.borderGradient} shadow-sm hover:shadow-md`}>
            <CardHeader>
              <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${service.iconBg}`}>
                {service.icon}
              </div>
              <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
              <CardDescription className="text-gray-700 mt-2">{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2"></div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleClick} 
                variant="ghost" 
                className="group relative overflow-hidden"
              >
                <span className="relative z-10">Learn more</span>
                <span className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></span>
                {isLoading && (
                  <svg className="animate-spin -mr-1 ml-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg p-4">
        <div>
          <h4 className="text-sm font-semibold flex items-center gap-2">
            {service.icon}
            <span>{service.title}</span>
          </h4>
          <p className="text-sm text-gray-600 mt-2">{service.detailedDescription}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default function ServicesSection() {
  return (
    <section className="py-16 px-6 w-full overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto relative">
        {/* Background decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-50 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-50 rounded-full opacity-30 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent inline-block mb-4">Our Services</h2>
              <p className="text-gray-600 md:text-lg max-w-2xl mx-auto">
                Nitra Mitra: <span className="italic">Empowering students through technology and collaborative learning</span>
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}