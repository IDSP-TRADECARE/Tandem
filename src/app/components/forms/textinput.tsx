interface LabeledInputProps {
    label?: string;
    placeholder?: string;
    type?: "text" | "password" | "email" | "tel" | "number";
    error?: boolean;
    disabled?: boolean;
    value: string;
    onChange: (value: string) => void;
    className?: string;
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
    ...rest
}) => {
    return (
        <div className='flex flex-col'>
            {label && (
                <label className='font-alan text-xl font-500 pb-2'>
                    {label}
                </label>
            )}

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className='font-omnes border-b-2 pb-1 pt-1 
                
                /*active*/
                focus:outline-1
                '
            />
        </div>
    );
};