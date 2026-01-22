import React from 'react';

const ShippingForm = ({ formData, onChange, errors = {} }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...formData, [name]: value });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>

            <div>
                <label className="block text-gray-700 mb-2 font-medium">
                    Street Address *
                </label>
                <input
                    type="text"
                    name="shippingAddress"
                    value={formData.shippingAddress || ''}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="123 Main Street"
                    required
                />
                {errors.shippingAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingAddress}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        City *
                    </label>
                    <input
                        type="text"
                        name="shippingCity"
                        value={formData.shippingCity || ''}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="New York"
                        required
                    />
                    {errors.shippingCity && (
                        <p className="text-red-500 text-sm mt-1">{errors.shippingCity}</p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        State *
                    </label>
                    <input
                        type="text"
                        name="shippingState"
                        value={formData.shippingState || ''}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="NY"
                        required
                    />
                    {errors.shippingState && (
                        <p className="text-red-500 text-sm mt-1">{errors.shippingState}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        ZIP Code *
                    </label>
                    <input
                        type="text"
                        name="shippingZip"
                        value={formData.shippingZip || ''}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="10001"
                        required
                    />
                    {errors.shippingZip && (
                        <p className="text-red-500 text-sm mt-1">{errors.shippingZip}</p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Country *
                    </label>
                    <input
                        type="text"
                        name="shippingCountry"
                        value={formData.shippingCountry || 'USA'}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="USA"
                        required
                    />
                    {errors.shippingCountry && (
                        <p className="text-red-500 text-sm mt-1">{errors.shippingCountry}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-gray-700 mb-2 font-medium">
                    Phone Number *
                </label>
                <input
                    type="tel"
                    name="shippingPhone"
                    value={formData.shippingPhone || ''}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="(555) 123-4567"
                    required
                />
                {errors.shippingPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingPhone}</p>
                )}
            </div>
        </div>
    );
};

export default ShippingForm;
