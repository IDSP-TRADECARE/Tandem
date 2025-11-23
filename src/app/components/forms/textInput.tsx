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
        <div className=''>
            {label && <label>{label}</label>}

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={className}
            />
        </div>
    );
};
