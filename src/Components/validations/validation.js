export const requiredValidator = {
    required: "This field is required"
  };

  export const numberValidator = {
    pattern: {
      value: /^[0-9]*$/,
      message: "Only digits are allowed"
    }
  };
  export function lengthValidator(min, max) {
    return {
      minLength: {
        value: min,
        message: `Must be at least ${min} digits`
      },
      maxLength: {
        value: max,
        message: `Must be no more than ${max} digits`
      }
    };
  }

  export const integerValidator = {
    pattern: {
      value: /^[0-9]+$/,
      message: "Only whole numbers (integers) are allowed"
    }
  };

  export function domainValidator() {
    return {
      // Regex to validate domain names
      pattern: {
        value: /^(?!\-)[A-Za-z0-9\-]{1,63}(?<!\-)\.(?!\-)[A-Za-z0-9\-]{1,63}(?<!\-)\.[A-Za-z]{2,6}$/,
        message: "Invalid domain name"
      }
    };
  }

  export const nameValidator = {
    // Check if name is not empty and has a minimum length
    minLength: {
      value: 2, // Minimum length for the name
      message: 'Name must be at least 2 characters long'
    },
    maxLength: {
      value: 50, // Maximum length for the name
      message: 'Name must be no more than 50 characters long'
    },
    pattern: {
      value: /^[A-Za-z\s]+$/, // Allows only letters and spaces
      message: 'Name must only contain letters and spaces'
    }
  };

  export const emailValidator = {
    // Check if email is valid
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Basic email format regex
      message: 'Invalid email address'
    }
  };