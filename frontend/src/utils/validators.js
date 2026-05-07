export const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

export const validatePassword = (value) => {
  if (value.length < 8 || value.length > 16) {
    return "Password must be 8-16 characters.";
  }
  if (!/[A-Z]/.test(value)) {
    return "Password must include an uppercase letter.";
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    return "Password must include a special character.";
  }
  return "";
};

export const validateName = (value) => {
  if (value.trim().length < 20 || value.trim().length > 60) {
    return "Name must be 20-60 characters.";
  }
  return "";
};

export const validateAddress = (value) => {
  if (!value.trim() || value.trim().length > 400) {
    return "Address is required and must be up to 400 characters.";
  }
  return "";
};
