"use client";

interface BloodHealthInfoProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

const bloodGroups = ['A+', 'A−', 'B+', 'B−', 'O+', 'O−', 'AB+', 'AB−'];
const chronicDiseases = ['Diabetes', 'Blood Pressure', 'Heart Disease', 'Other'];

export default function BloodHealthInfo({ formData, updateFormData, errors }: BloodHealthInfoProps) {
  const toggleDisease = (disease: string) => {
    const current = formData.chronicDiseases || [];
    if (current.includes(disease)) {
      updateFormData('chronicDiseases', current.filter((d: string) => d !== disease));
    } else {
      updateFormData('chronicDiseases', [...current, disease]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Blood & Health Information</h3>
        <p className="text-sm text-gray-600">Help us understand your health profile</p>
      </div>

      {/* Blood Group */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Blood Group <span className="text-red-600">*</span>
        </label>
        <select
          value={formData.bloodGroup || ''}
          onChange={(e) => updateFormData('bloodGroup', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-1 outline-none transition text-gray-900 ${
            errors.bloodGroup ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
          }`}
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
        {errors.bloodGroup && <p className="mt-1 text-xs text-red-600">{errors.bloodGroup}</p>}
      </div>

      {/* First Donation */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Is this your first blood donation? <span className="text-red-600">*</span>
        </label>
        <div className="flex gap-4">
          {['Yes', 'No'].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="firstDonation"
                value={option}
                checked={formData.firstDonation === option}
                onChange={(e) => updateFormData('firstDonation', e.target.value)}
                className="w-4 h-4 text-red-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        {errors.firstDonation && <p className="mt-1 text-xs text-red-600">{errors.firstDonation}</p>}
      </div>

      {/* Last Donation Date */}
      {formData.firstDonation === 'No' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Last Blood Donation Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            value={formData.lastDonationDate || ''}
            onChange={(e) => updateFormData('lastDonationDate', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-1 outline-none transition text-gray-900 ${
              errors.lastDonationDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
            }`}
          />
          {errors.lastDonationDate && <p className="mt-1 text-xs text-red-600">{errors.lastDonationDate}</p>}
        </div>
      )}

      {/* Weight */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Weight (in kg) <span className="text-red-600">*</span>
        </label>
        <input
          type="number"
          value={formData.weight || ''}
          onChange={(e) => updateFormData('weight', e.target.value)}
          placeholder="50"
          min="0"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-1 outline-none transition text-gray-900 placeholder-gray-400 ${
            errors.weight ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
          }`}
        />
        {formData.weight && formData.weight < 50 && (
          <p className="mt-1 text-sm text-orange-600">Minimum weight requirement is 50 kg</p>
        )}
        {errors.weight && <p className="mt-1 text-xs text-red-600">{errors.weight}</p>}
      </div>

      {/* Chronic Diseases */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Do you have any chronic diseases?
        </label>
        <div className="flex gap-4 mb-3">
          {['Yes', 'No'].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="hasChronicDisease"
                value={option}
                checked={formData.hasChronicDisease === option}
                onChange={(e) => {
                  updateFormData('hasChronicDisease', e.target.value);
                  if (e.target.value === 'No') updateFormData('chronicDiseases', []);
                }}
                className="w-4 h-4 text-red-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>

        {formData.hasChronicDisease === 'Yes' && (
          <div className="space-y-2 ml-4">
            {chronicDiseases.map((disease) => (
              <label key={disease} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formData.chronicDiseases || []).includes(disease)}
                  onChange={() => toggleDisease(disease)}
                  className="w-4 h-4 text-red-600 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-700">{disease}</span>
              </label>
            ))}
            {(formData.chronicDiseases || []).includes('Other') && (
              <input
                type="text"
                value={formData.otherDisease || ''}
                onChange={(e) => updateFormData('otherDisease', e.target.value)}
                placeholder="Specify other disease"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition text-sm text-gray-900 placeholder-gray-400"
              />
            )}
          </div>
        )}
      </div>

      {/* Medication */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Are you currently on any medication?
        </label>
        <div className="flex gap-4">
          {['Yes', 'No'].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="onMedication"
                value={option}
                checked={formData.onMedication === option}
                onChange={(e) => updateFormData('onMedication', e.target.value)}
                className="w-4 h-4 text-red-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Recent Surgery */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Have you had surgery in the last 6 months?
        </label>
        <div className="flex gap-4">
          {['Yes', 'No'].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="recentSurgery"
                value={option}
                checked={formData.recentSurgery === option}
                onChange={(e) => updateFormData('recentSurgery', e.target.value)}
                className="w-4 h-4 text-red-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Infectious Diseases */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Do you have any infectious diseases?
        </label>
        <div className="flex gap-4">
          {['Yes', 'No'].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="infectiousDiseases"
                value={option}
                checked={formData.infectiousDiseases === option}
                onChange={(e) => updateFormData('infectiousDiseases', e.target.value)}
                className="w-4 h-4 text-red-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
