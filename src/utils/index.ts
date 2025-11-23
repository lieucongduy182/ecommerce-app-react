export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join('-').substring(0, 19);
};

export const formatExpiryDate = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
  }
  return cleaned;
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return /^\+?[\d\s-]{10,}$/.test(phone);
};

