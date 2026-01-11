"use client";

interface LocationAvailabilityProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const availableDays = ['Weekdays', 'Weekends', 'Anytime'];

export default function LocationAvailability({ formData, updateFormData, errors }: LocationAvailabilityProps) {
  const toggleDay = (day: string) => {
    const current = formData.availableDays || [];
    if (current.includes(day)) {
      updateFormData('availableDays', current.filter((d: string) => d !== day));
    } else {
      updateFormData('availableDays', [...current, day]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Location & Availability</h3>
        <p className="text-sm text-gray-600">Where can we reach you?</p>
      </div>

      {/* State */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          State <span className="text-red-600">*</span>
        </label>
        <select
          value={formData.state || ''}
          onChange={(e) => updateFormData('state', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-1 outline-none transition text-gray-900 ${
            errors.state ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
          }`}
        >
          <option value="">Select State</option>
          {indianStates.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
      </div>

      {/* District */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          District <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={formData.district || ''}
          onChange={(e) => updateFormData('district', e.target.value)}
          placeholder="Enter district name"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-1 outline-none transition text-gray-900 placeholder-gray-400 ${
            errors.district ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
          }`}
        />
        {errors.district && <p className="mt-1 text-xs text-red-600">{errors.district}</p>}
      </div>

      {/* City/Village */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          City / Village <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={formData.city || ''}
          onChange={(e) => updateFormData('city', e.target.value)}
          placeholder="Enter city or village name"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-1 outline-none transition text-gray-900 placeholder-gray-400 ${
            errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
          }`}
        />
        {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
      </div>

      {/* Pincode */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Pincode <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={formData.pincode || ''}
          onChange={(e) => updateFormData('pincode', e.target.value)}
          placeholder="123456"
          maxLength={6}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-1 outline-none transition text-gray-900 placeholder-gray-400 ${
            errors.pincode ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
          }`}
        />
        {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
      </div>

      {/* Donation Radius */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Willing to donate within <span className="text-red-600">*</span>
        </label>
        <select
          value={formData.donationRadius || ''}
          onChange={(e) => updateFormData('donationRadius', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-1 outline-none transition text-gray-900 ${
            errors.donationRadius ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
          }`}
        >
          <option value="">Select distance</option>
          <option value="10">10 km</option>
          <option value="20">20 km</option>
          <option value="50">50 km</option>
        </select>
        {errors.donationRadius && <p className="mt-1 text-xs text-red-600">{errors.donationRadius}</p>}
      </div>

      {/* Available Days */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Available Days <span className="text-red-600">*</span>
        </label>
        <div className="space-y-2">
          {availableDays.map((day) => (
            <label key={day} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(formData.availableDays || []).includes(day)}
                onChange={() => toggleDay(day)}
                className="w-4 h-4 text-red-600 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-700">{day}</span>
            </label>
          ))}
        </div>
        {errors.availableDays && <p className="mt-1 text-xs text-red-600">{errors.availableDays}</p>}
      </div>

      {/* Preferred Contact Method */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Preferred Contact Method <span className="text-red-600">*</span>
        </label>
        <div className="flex gap-4">
          {['Phone', 'SMS', 'WhatsApp', 'Email'].map((method) => (
            <label key={method} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="contactMethod"
                value={method}
                checked={formData.contactMethod === method}
                onChange={(e) => updateFormData('contactMethod', e.target.value)}
                className="w-4 h-4 text-red-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{method}</span>
            </label>
          ))}
        </div>
        {errors.contactMethod && <p className="mt-1 text-xs text-red-600">{errors.contactMethod}</p>}
      </div>

      {/* Emergency Donation */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Willing for emergency donation?
        </label>
        <div className="flex gap-4">
          {['Yes', 'No'].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="emergencyDonation"
                value={option}
                checked={formData.emergencyDonation === option}
                onChange={(e) => updateFormData('emergencyDonation', e.target.value)}
                className="w-4 h-4 text-red-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">Emergency donations may require immediate response</p>
      </div>
    </div>
  );
}
