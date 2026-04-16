export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validatePhoneNumber = (phone) => {
  const re = /^[\d\s\-\+\(\)]+$/;
  return phone && re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateAddress = (address) => {
  return address && address.trim().length >= 5;
};

export const validatePrice = (price) => {
  return !isNaN(price) && parseFloat(price) > 0;
};

export const validateQuantity = (quantity) => {
  const num = parseInt(quantity);
  return num > 0 && num <= 100;
};

export const validateLoginForm = (email, password) => {
  const errors = {};
  
  if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
};

export const validateSignupForm = (name, email, password, confirmPassword) => {
  const errors = {};
  
  if (!validateName(name)) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};

export const validateProfileForm = (name, phoneNumber, address) => {
  const errors = {};
  
  if (!validateName(name)) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number';
  }
  
  if (address && !validateAddress(address)) {
    errors.address = 'Address must be at least 5 characters';
  }
  
  return errors;
};
