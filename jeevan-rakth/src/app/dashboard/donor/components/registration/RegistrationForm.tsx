"use client";
import { useState } from "react";
import PersonalDetails from "./PersonalDetails";
import BloodHealthInfo from "./BloodHealthInfo";
import LocationAvailability from "./LocationAvailability";
import ConsentSubmission from "./ConsentSubmission";
import Toast from "@/components/Toast";

interface RegistrationFormProps {
  onBack: () => void;
}

export default function RegistrationForm({ onBack }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const steps = [
    { id: 1, title: "Personal Details", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: 2, title: "Blood & Health", icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" },
    { id: 3, title: "Location & Availability", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
    { id: 4, title: "Consent & Submit", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName?.trim()) newErrors.fullName = "Full name is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      else {
        const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
        if (age < 18) newErrors.dateOfBirth = "You must be at least 18 years old";
      }
      if (!formData.gender) newErrors.gender = "Please select gender";
      if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
      else if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Enter valid 10-digit mobile number";
    }

    if (step === 2) {
      if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
      if (!formData.firstDonation) newErrors.firstDonation = "Please select an option";
      if (formData.firstDonation === 'No' && !formData.lastDonationDate) {
        newErrors.lastDonationDate = "Last donation date is required";
      }
      if (!formData.weight) newErrors.weight = "Weight is required";
      else if (formData.weight < 50) newErrors.weight = "Minimum weight requirement is 50 kg";
    }

    if (step === 3) {
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.district?.trim()) newErrors.district = "District is required";
      if (!formData.city?.trim()) newErrors.city = "City/Village is required";
      if (!formData.pincode) newErrors.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter valid 6-digit pincode";
      if (!formData.donationRadius) newErrors.donationRadius = "Please select donation radius";
      if (!formData.availableDays || formData.availableDays.length === 0) {
        newErrors.availableDays = "Please select at least one available day";
      }
      if (!formData.contactMethod) newErrors.contactMethod = "Please select preferred contact method";
    }

    if (step === 4) {
      if (!formData.consentAccuracy) newErrors.consentAccuracy = "You must confirm the accuracy of information";
      if (!formData.consentContact) newErrors.consentContact = "You must give consent to be contacted";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form Data:", formData);
      // TODO: Save to API and refresh registrations list
      setToast({ message: 'Registration submitted successfully!', type: 'success' });
      setTimeout(() => onBack(), 1500);
    } catch (error) {
      console.error("Submission error:", error);
      setToast({ message: 'Failed to submit registration. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-pink-600 px-6 py-5 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Donor Registration</h2>
            <p className="text-xs text-red-100">Join the lifesaving community</p>
          </div>
        </div>
      </div>

        {/* Stepper */}
        <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-red-50 border-b border-red-100">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                    currentStep > step.id
                      ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg scale-110'
                      : currentStep === step.id
                      ? 'bg-gradient-to-br from-red-600 to-pink-600 shadow-xl ring-4 ring-red-200 scale-110'
                      : 'bg-gray-300 scale-100'
                  }`}>
                    {currentStep > step.id ? (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={step.icon} clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className={`mt-2 text-xs font-semibold hidden sm:block transition-colors ${
                    currentStep >= step.id ? 'text-red-700' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                    currentStep > step.id ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

      {/* Form Content */}
      <div className="p-6 bg-gradient-to-b from-white to-gray-50">
        {currentStep === 1 && <PersonalDetails formData={formData} updateFormData={updateFormData} errors={errors} />}
        {currentStep === 2 && <BloodHealthInfo formData={formData} updateFormData={updateFormData} errors={errors} />}
        {currentStep === 3 && <LocationAvailability formData={formData} updateFormData={updateFormData} errors={errors} />}
        {currentStep === 4 && <ConsentSubmission formData={formData} updateFormData={updateFormData} errors={errors} />}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-red-50 border-t border-red-100 flex justify-between items-center rounded-b-lg">
        <button
          onClick={currentStep === 1 ? onBack : handleBack}
          className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:border-gray-400 transition-all font-semibold shadow-sm flex items-center gap-2"
        >
            {currentStep !== 1 && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            )}
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Registration
                </>
              )}
            </button>
        )}
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
