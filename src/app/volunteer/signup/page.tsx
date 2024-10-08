"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { z } from "zod";
import { FormDataSchema } from "@/lib/utils/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = z.infer<typeof FormDataSchema>;

const steps = [
  {
    id: "Step 1",
    name: "Personal Information",
    fields: ["firstName", "lastName", "email"],
  },
  {
    id: "Step 2",
    name: "Address",
    fields: ["country", "state", "city", "street", "zip"],
  },
  {
    id: "Step 3",
    name: "Password",
    fields: ["password", "confirmPassword"],
  },
  {
    id: "Step 4",
    name: "Confirm",
  },
];

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  });

  const processForm: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    reset();
  };

  const next = async () => {
    if (currentStep === 1 && useCurrentLocation) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
      return;
    }

    const fields = steps[currentStep].fields || [];
    const output = await trigger(fields as (keyof Inputs)[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    } else {
      await handleSubmit(processForm)();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
      });
    }
  };

  return (
    <section className="flex flex-col justify-between p-10 bg-gray-900 text-white">
      {/* Progress steps */}
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              <div
                className={`group flex w-full flex-col py-2 pl-4 transition-colors md:pb-0 md:pt-4 
                ${
                  currentStep >= index
                    ? "border-l-4 border-blue-600 md:border-t-4"
                    : "border-l-4 border-gray-200 md:border-t-4"
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    currentStep >= index ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form className="mt-12 space-y-6" onSubmit={handleSubmit(processForm)}>
        {currentStep === 0 && (
          <motion.div
            initial={{
              x: previousStep < currentStep ? "50%" : "-50%",
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-lg font-semibold leading-7">
              Personal Information
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
              <Input
                  id="First Name"
                  {...register("firstName")}
                  placeholder="first name"
                  className="dark:bg-gray-800 dark:text-white"
                />
                {errors.firstName?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-3">
                <Input
                  id="Last Name"
                  {...register("lastName")}
                  placeholder="surname"
                  className="dark:bg-gray-800 dark:text-white"
                />
                {errors.lastName?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-6">
                <Input
                  id="Email"
                  type="email"
                  {...register("email")}
                  placeholder="abc@example.com"
                  className="dark:bg-gray-800 dark:text-white"
                />
                {errors.email?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{
              x: previousStep < currentStep ? "50%" : "-50%",
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-lg font-semibold leading-7">
              Address Information
            </h2>
            <div className="mt-4">
              <Checkbox
                id="Use current location"
                onCheckedChange={(value: any) => {
                  setUseCurrentLocation(value);
                  if (value) handleLocation();
                }}
                checked={useCurrentLocation}
                className="dark:bg-gray-800 dark:text-white"
              />
            </div>

            {useCurrentLocation ? (
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Input
                    id="Latitude"
                    value={latitude}
                    readOnly
                    placeholder="Latitude"
                    className="dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    id="Longitude"
                    value={longitude}
                    readOnly
                    placeholder="Longitude"
                    className="dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Input
                    id="Country"
                    type="text"
                    {...register("country")}
                    placeholder="your country"
                    className="dark:bg-gray-800 dark:text-white"
                  />
                  {errors.country?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.country.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-3">
                  <Input
                    id="State"
                    type="text"
                    {...register("state")}
                    placeholder="your state"
                    className="dark:bg-gray-800 dark:text-white"
                  />
                  {errors.state?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-3">
                  <Input
                    id="City"
                    type="text"
                    {...register("city")}
                    placeholder="Your city"
                    className="dark:bg-gray-800 dark:text-white"
                  />
                  {errors.city?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-6">
                  <Input
                    id="Street"
                    type="text"
                    {...register("street")}
                    placeholder="nearest street"
                    className="dark:bg-gray-800 dark:text-white"
                  />
                  {errors.street?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.street.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-3">
                  <Input
                    id="Zip Code"
                    type="text"
                    {...register("zip")}
                    placeholder="Postal Code"
                    className="dark:bg-gray-800 dark:text-white"
                  />
                  {errors.zip?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.zip.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{
              x: previousStep < currentStep ? "50%" : "-50%",
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-lg font-semibold leading-7">Password</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Input
                  id="Password"
                  type="password"
                  {...register("password")}
                  placeholder="Password"
                  className="dark:bg-gray-800 dark:text-white"
                />
                {errors.password?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-3">
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Confirm Password"
                  className="dark:bg-gray-800 dark:text-white"
                />
                {errors.confirmPassword?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            initial={{
              x: previousStep < currentStep ? "50%" : "-50%",
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-lg font-semibold leading-7">Confirmation</h2>
            <div className="mt-6">
              <p>First Name: {watch("firstName")}</p>
              <p>Last Name: {watch("lastName")}</p>
              <p>Email: {watch("email")}</p>
              <p>Country: {watch("country")}</p>
              <p>State: {watch("state")}</p>
              <p>City: {watch("city")}</p>
              <p>Street: {watch("street")}</p>
              <p>Zip Code: {watch("zip")}</p>
            </div>
          </motion.div>
        )}
      </form>
      {/* Navigation */}
      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
            className="rounded bg-white dark:bg-black px-2 py-1 text-sm font-semibold text-sky-900 dark:text-white  shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className="rounded bg-white dark:bg-black px-2 py-1 text-sm font-semibold text-sky-900 dark:text-white  shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
