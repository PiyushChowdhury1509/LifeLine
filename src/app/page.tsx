"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { Button } from "@/components/ui/button";
import { PinContainer } from "@/components/ui/3d-pin";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Procedure {
  title: string;
  description: string;
}

const procedures: Procedure[] = [
  {
    title: "Step 1: Report the Accident",
    description:
      "Upload photos and videos of the accident scene with a brief description.",
  },
  {
    title: "Step 2: Verification",
    description:
      "Our AI system verifies the authenticity of the report using machine learning.",
  },
  {
    title: "Step 3: Finds nearest Helpers",
    description:
      "Our system finds the nearest volunteers and hospital to aid in this situation",
  },
  {
    title: "Step 4: Notify Volunteers",
    description:
      "Nearby volunteers are notified and can respond to the situation immediately.",
  },
  {
    title: "Step 5: Notify Hospitals",
    description:
      "If serious, the nearest hospital is informed and prepared for emergency care.",
  },
  {
    title: "Step 6: Monitor and Resolve",
    description:
      "The accident is monitored until resolved, ensuring quick and effective responses.",
  },
];

const LandingPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReportClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleProceed = () => {
    setIsLoading(true);
    setIsDialogOpen(false);
    router.push("/reportingPage");
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Lamp Section */}
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-12 text-center text-4xl font-bold tracking-tight text-transparent bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text md:text-6xl lg:text-7xl"
        >
          Save Lives <br /> with just a click
        </motion.h1>

        {/* Report Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.2,
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="mt-10"
        >
          <Button
            onClick={handleReportClick}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2Icon className="animate-spin h-5 w-5" />
            ) : (
              "Report an Accident"
            )}
          </Button>
        </motion.div>
      </LampContainer>

      {/* Procedure Cards */}
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl">
        {procedures.map((procedure, index) => (
          <PinContainer key={index} title={procedure.title}>
            <div className="flex flex-col p-4 tracking-tight text-slate-100/50 w-[20rem] h-[20rem]">
              <h3 className="font-bold text-lg text-slate-100">
                {procedure.title}
              </h3>
              <p className="text-base text-slate-500 mt-2">
                {procedure.description}
              </p>
              <div className="flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
            </div>
          </PinContainer>
        ))}
      </div>

      {/* Dialog Box */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="max-w-4xl p-6">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold">Report an Accident</DialogTitle>
      <DialogDescription className="text-lg mt-4">
        <p>Please follow these steps to report an accident:</p>
        <ol className="list-decimal ml-6 mt-2">
          <li>Take clear photos and videos of the accident scene.</li>
          <li>Provide a brief description of the accident.</li>
          <li>Your identity will remain anonymous.</li>
        </ol>
      </DialogDescription>
    </DialogHeader>
    <div className="flex justify-end mt-4">
      <Button onClick={handleCloseDialog} className="mr-2 bg-gray-300">
        Cancel
      </Button>
      <Button onClick={handleProceed} className="bg-blue-600">
        Proceed
      </Button>
    </div>
  </DialogContent>
</Dialog>

    </div>
  );
};

export default LandingPage;
