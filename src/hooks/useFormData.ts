import { useState } from 'react';
import { FormData, FormErrors } from '@/types/form';
import { validateForm } from '@/lib/validation';

export function useFormData() {
  const [formData, setFormData] = useState<FormData>({
    userName: '',
    childcareOrgName: '',
    contactInfo: '',
    customMessage: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const validationErrors = validateForm(
      formData.userName,
      formData.childcareOrgName,
      formData.contactInfo
    );
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  return { formData, errors, updateField, validate };
}