import React from "react";

interface LabeledInputProps {
    label?: string;
    placeholder?: string;
    type?: "text" | "password" | "email" | "tel" | "number";
    error?: boolean;
    disabled?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconClick?: () => void;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
    label,
    placeholder = "",
    value,
    onChange,
    type = "text",
    disabled = false,
    error = false,
    className = "",
    leftIcon,
    rightIcon,
    onRightIconClick,
    ...rest
}) => {
    return (
        <div className='flex flex-col pt-6'>
            {label && (
                <label className='font-alan text-xl font-700 pb-1'>
                    {label}
                </label>
            )}

            <div className='relative border-b-2 pt-1 '>
                {/* Left Icon */}
                {leftIcon && (
                    <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none'>
                        {leftIcon}
                    </div>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`font-omnes
                ${leftIcon ? "pl-12" : "pl-4"}
                ${rightIcon ? "pr-12" : "pr-4"}
                ${error ? "border-red-500" : ""}
                /*active*/
                focus:outline-1`}
                />
                {/* Right Icon (clickable if handler provided) */}
                {rightIcon && (
                    <button
                        type='button'
                        onClick={onRightIconClick}
                        disabled={disabled}
                        className={`
              absolute right-4 top-1/2 -translate-y-1/2 text-gray-500
              ${
                  onRightIconClick
                      ? "cursor-pointer hover:text-gray-700"
                      : "pointer-events-none"
              }
              ${disabled ? "opacity-50" : ""}
            `}>
                        {rightIcon}
                    </button>
                )}
            </div>
        </div>
    );
};
