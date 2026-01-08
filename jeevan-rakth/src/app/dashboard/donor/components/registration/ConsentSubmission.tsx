"use client";

interface ConsentSubmissionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function ConsentSubmission({ formData, updateFormData, errors }: ConsentSubmissionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Consent & Submission</h3>
        <p className="text-sm text-gray-600">Please review and confirm your information</p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-gray-900">Registration Summary</h4>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Name:</p>
            <p className="font-medium text-gray-900">{formData.fullName || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Blood Group:</p>
            <p className="font-medium text-gray-900">{formData.bloodGroup || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Mobile:</p>
            <p className="font-medium text-gray-900">{formData.mobileNumber || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Location:</p>
            <p className="font-medium text-gray-900">{formData.city || '-'}, {formData.state || '-'}</p>
          </div>
        </div>
      </div>

      {/* Consent Checkboxes */}
      <div className="space-y-4">
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consentAccuracy || false}
              onChange={(e) => updateFormData('consentAccuracy', e.target.checked)}
              className={`mt-1 w-5 h-5 text-red-600 rounded cursor-pointer ${
                errors.consentAccuracy ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="text-sm text-gray-700">
              I confirm that all the information provided is true and accurate. <span className="text-red-600">*</span>
            </span>
          </label>
          {errors.consentAccuracy && <p className="mt-1 ml-8 text-xs text-red-600">{errors.consentAccuracy}</p>}
        </div>

        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consentContact || false}
              onChange={(e) => updateFormData('consentContact', e.target.checked)}
              className={`mt-1 w-5 h-5 text-red-600 rounded cursor-pointer ${
                errors.consentContact ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="text-sm text-gray-700">
              I give consent to be contacted by hospitals and NGOs for blood donation purposes. <span className="text-red-600">*</span>
            </span>
          </label>
          {errors.consentContact && <p className="mt-1 ml-8 text-xs text-red-600">{errors.consentContact}</p>}
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Important Information</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>You must be at least 18 years old and weigh at least 50 kg</li>
              <li>Ensure you are in good health on the day of donation</li>
              <li>You can donate blood every 3 months (90 days)</li>
              <li>Bring a valid government ID on the day of donation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
