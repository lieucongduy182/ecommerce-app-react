import { useState } from "react";
import type { ShippingInfo, User } from "../../types";
import { validateEmail, validatePhone } from "../../utils";
import { STEPS, type STEP } from "../../utils/constants";

interface Props {
  user: User;
  setStep: (step: STEP) => void;
  shippingInfo: ShippingInfo;
  setShippingInfo: React.Dispatch<React.SetStateAction<ShippingInfo>>;
}

const Shipping: React.FC<Props> = ({
  user,
  setStep,
  shippingInfo,
  setShippingInfo,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) return null;

  const validateShipping = () => {
    const newErrors: Record<string, string> = {};

    if (!shippingInfo.fullName.trim()) newErrors.fullName = "Name is required";
    if (!shippingInfo.phone.trim()) newErrors.phone = "Phone is required";
    else if (!validatePhone(shippingInfo.phone))
      newErrors.phone = "Invalid phone number";
    if (!shippingInfo.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(shippingInfo.email))
      newErrors.email = "Invalid email address";
    if (!shippingInfo.postalCode.trim())
      newErrors.postalCode = "Postal code is required";
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.detailedAddress.trim())
      newErrors.detailedAddress = "Detailed address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingNext = () => {
    if (validateShipping()) {
      setStep(STEPS.PAYMENT);
    }
  };

  const handleShippingInfo = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Shipping Information
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={shippingInfo.fullName}
              onChange={handleShippingInfo}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              value={shippingInfo.phone}
              name="phone"
              onChange={handleShippingInfo}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={shippingInfo.email}
            onChange={handleShippingInfo}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code *
          </label>
          <input
            type="text"
            value={shippingInfo.postalCode}
            onChange={handleShippingInfo}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
              errors.postalCode ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            value={shippingInfo.address}
            onChange={handleShippingInfo}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Address *
          </label>
          <input
            type="text"
            value={shippingInfo.detailedAddress}
            onChange={(e) =>
              setShippingInfo({
                ...shippingInfo,
                detailedAddress: e.target.value,
              })
            }
            placeholder="Apartment, suite, unit, etc."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
              errors.detailedAddress ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.detailedAddress && (
            <p className="text-red-500 text-sm mt-1">
              {errors.detailedAddress}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Notes (Optional)
          </label>
          <textarea
            value={shippingInfo.deliveryNotes}
            onChange={handleShippingInfo}
            rows={3}
            placeholder="Special instructions for delivery"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>
      <button
        onClick={handleShippingNext}
        className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default Shipping;
