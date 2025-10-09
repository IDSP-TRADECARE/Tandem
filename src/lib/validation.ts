import { FormErrors } from '@/types/form';

export function validateForm(
  userName: string,
  childcareOrgName: string,
  contactInfo: string
): FormErrors {
  const errors: FormErrors = {};

  if (!userName.trim()) {
    errors.userName = 'Your name is required';
  }

  if (!childcareOrgName.trim()) {
    errors.childcareOrgName = 'Organization name is required';
  }

  if (!contactInfo.trim()) {
    errors.contactInfo = 'Contact information is required';
  } else if (!isValidEmail(contactInfo) && !isValidPhone(contactInfo)) {
    errors.contactInfo = 'Please enter a valid email or phone number';
  }

  return errors;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}