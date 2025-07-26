

export const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
    onChange,
    required = false,
    defaultValue,
    disabled = false,
}) => (
    <tr className="bg-gray-50 dark:bg-gray-900">
        <th className="px-4 py-3 font-semibold">
            {label} {required && <span className="text-red-500">*</span>}
        </th>
        <td className="px-4 py-3">
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                required={required}
                defaultValue={defaultValue}
                disabled={disabled}
                min={type === "number" ? 1 : undefined}
                className="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 bg-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            />
        </td>
    </tr>
);

export const SelectField = ({
    label,
    name,
    options,
    onChange,
    required = false,
    value = '',
    disabled = false,
}) => (
    <tr className="bg-gray-50 dark:bg-gray-900">
        <th className="px-4 py-3 font-semibold">
            {label} {required && <span className="text-red-500">*</span>}
        </th>
        <td className="px-4 py-3 relative">
            <select
                name={name}
                onChange={onChange}
                value={value}
                disabled={disabled}
                required={required}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-300 appearance-none"
            >
                <option value="">Select {label}</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <span className="absolute right-4 top-3 text-gray-500 dark:text-gray-400 pointer-events-none">▼</span>
        </td>
    </tr>
);
