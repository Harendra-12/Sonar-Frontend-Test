export const requiredValidator = {
  required: "This field is required",
};

export const numberValidator = {
  pattern: {
    value: /^[0-9]*$/,
    message: "Only digits are allowed",
  },
};
export function lengthValidator(min, max) {
  return {
    minLength: {
      value: min,
      message: `Must be at least ${min} digits`,
    },
    maxLength: {
      value: max,
      message: `Must be no more than ${max} digits`,
    },
  };
}

export const integerValidator = {
  pattern: {
    value: /^[0-9]+$/,
    message: "Only whole numbers (integers) are allowed",
  },
};

export function domainValidator() {
  return {
    // Regex to validate domain names
    pattern: {
      value:
        /^(?!\-)[A-Za-z0-9\-]{1,63}(?<!\-)\.(?!\-)[A-Za-z0-9\-]{1,63}(?<!\-)\.[A-Za-z]{2,6}$/,
      message: "Invalid domain name",
    },
  };
}

export const nameValidator = {
  minLength: {
    value: 2,
    message: "Name must be at least 2 characters long",
  },
  maxLength: {
    value: 50,
    message: "Name must be no more than 50 characters long",
  },
  pattern: {
    value: /^[A-Za-z\s\-]+$/, // Allows letters, spaces, and hyphens
    message: "Name must only contain letters, spaces, and hyphens",
  },
};

export const nameNumberValidator = {
  minLength: {
    value: 2,
    message: "Name must be at least 2 characters long",
  },
  maxLength: {
    value: 50,
    message: "Name must be no more than 50 characters long",
  },
  pattern: {
    value: /^[A-Za-z0-9\s\-]+$/, // Allows letters, numbers, spaces, and hyphens
    message: "Name must only contain letters, numbers, spaces, and hyphens",
  },
};

export const emailValidator = {
  // Check if email is valid
  pattern: {
    value: /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
    message: "Invalid email address",
  },
};

export const usagesValidator = {
  validate: (value) =>
    value.length > 0 || "At least one option must be selected",
};

export const noSpecialCharactersValidator = {
  // Check if the input contains only letters, numbers, spaces, and hyphens
  pattern: {
    value: /^[A-Za-z0-9\s\-]+$/, // Allows letters, numbers, spaces, and hyphens
    message:
      "Input must only contain letters, numbers, spaces, and hyphens, without any other special characters",
  },
};

export const noSpecialCharNumberValidator = {
  // Check if the input contains only numbers, spaces, and hyphens
  pattern: {
    value: /^[0-9\s\-]+$/, // Allows numbers, spaces, and hyphens
    message: "Input must only contain numbers, spaces, and hyphens.",
  },
};

export const minValidator = (min) => {
  return {
    // minLength: {
    //   value: min,
    //   message: `Value must be at least ${min}`,
    // },
    validate: (value) => {
      // console.log('Validating value:', Number(value), 'with minimum:', min);
      return Number(value) >= min || `Value must be at least ${min}`;
    },
    // min: min,
    // message: `Value must be at least ${min}`,
  };
};

// Define allowed characters: a-z, A-Z, 0-9, @, ., and -
export const restrictToAllowedChars = (e) => {
  const allowedKeys = /^[a-zA-Z0-9@.\-]$/;
  if (
    !allowedKeys.test(e.key) &&
    e.key !== "Backspace" &&
    e.key !== "Tab" &&
    e.key !== "ArrowLeft" &&
    e.key !== "ArrowRight" &&
    e.key !== "Delete"
  ) {
    e.preventDefault();
  }
};

// Allow only number keys (0-9) and some special keys
export const restrictToNumbers = (e) => {
  const allowedKey = /[0-9]/;
  if (
    !allowedKey.test(e.key) &&
    e.key !== "Backspace" &&
    e.key !== "Tab" &&
    e.key !== "ArrowLeft" &&
    e.key !== "ArrowRight" &&
    e.key !== "Delete"
  ) {
    e.preventDefault();
  }
};
