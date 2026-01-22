import React from 'react';

const ShippingMethodSelector = ({ methods, selectedMethod, onSelect, orderTotal }) => {
    const isFreeShippingEligible = orderTotal >= 100;

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Shipping Method</h3>

            {isFreeShippingEligible && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-800 font-medium flex items-center">
                        <svg className="w-5 h-5 mr-2" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        You qualify for FREE Standard Shipping!
                    </p>
                </div>
            )}

            <div className="space-y-3">
                {methods.map((method) => (
                    <div
                        key={method.id}
                        onClick={() => onSelect(method)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedMethod?.id === method.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="mr-3 flex items-center justify-center">
                                    <input
                                        type="radio"
                                        name="shippingMethod"
                                        checked={selectedMethod?.id === method.id}
                                        onChange={() => onSelect(method)}
                                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 flex items-center">
                                        {method.name}
                                        {method.isFree && (
                                            <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                FREE
                                            </span>
                                        )}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {method.deliveryDays.min === method.deliveryDays.max
                                            ? `${method.deliveryDays.min} business day${method.deliveryDays.min > 1 ? 's' : ''}`
                                            : `${method.deliveryDays.min}-${method.deliveryDays.max} business days`
                                        }
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Carrier: {method.carrier}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                {method.isFree ? (
                                    <div>
                                        <p className="text-xl font-bold text-green-600">FREE</p>
                                        <p className="text-xs text-gray-500 line-through">
                                            ${method.originalCost.toFixed(2)}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-xl font-bold text-gray-800">
                                        ${method.cost.toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!selectedMethod && (
                <p className="text-red-500 text-sm mt-2">Please select a shipping method</p>
            )}
        </div>
    );
};

export default ShippingMethodSelector;
