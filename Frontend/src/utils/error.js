export const mapFieldErrors = (response) => {
  const fieldErrors = {};

  response.reasons?.forEach((error) => {
    if (error.field) {
      fieldErrors[error.field] = error.message;
    } else {
      fieldErrors.general = error.message;
    }
  });

  return fieldErrors;
};
