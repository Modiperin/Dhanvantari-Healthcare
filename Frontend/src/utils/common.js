import { differenceInYears, parse } from "date-fns";

export const removeEmptyValues = (obj, values = []) => {
  const nullishValues = [null, undefined, ...values];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Check if the property is directly on the object
      const value = obj[key];
      if (nullishValues.includes(value)) {
        delete obj[key];
      }
    }
  }
  return obj;
};

export const dobToAge = (dob) => {
  // return new Date().getFullYear() - new Date(parse(dob,'dd-MM-yyyy',new Date())).getFullYear();
  if (dob) {
    const dobDate = parse(dob, "dd-MM-yyyy", new Date());
    const age = differenceInYears(new Date(), dobDate);
    return age;
  }
  return "N/A";
};

export const handleDOBChange = (date, dateString, setValue) => {
  if (!dateString) {
    setValue("age", 0, { shouldValidate: true });
    return;
  }
  const age = dobToAge(dateString);
  setValue("age", age || 0, { shouldValidate: true });
};

export const convertToHookFormErrors = (errors) => {
  return errors.reduce((acc, el) => {
    const { field, message } = el;
    acc[field] = { message };
    return acc;
  }, {});
};

export const formatDateToReadable = (
  dateString,
  withoutDate = false,
  isUTC = false
) => {
  let newDateString;
  if (isUTC) {
    const date = new Date(dateString);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getUTCFullYear();

    newDateString = `${day}-${month}-${year}`;
  }
  const [day, month, year] = (isUTC ? newDateString : dateString)
    .split("-")
    .map(Number);

  // Create a new Date object
  // Note: Months are 0-indexed in JavaScript, so we subtract 1 from the month
  const date = new Date(year, month - 1, day);

  // Get the day, month name, and year from the Date object
  const formattedDay = date.getDate();
  const formattedMonth = date.toLocaleString("en-US", {
    month: "short",
  });
  const formattedYear = date.getFullYear();

  // Return the formatted date string
  return withoutDate
    ? `${formattedMonth} ${formattedYear}`
    : `${formattedDay} ${formattedMonth} ${formattedYear}`;
};

export const getNestedError = (obj, path) => {
  return path?.split(".")?.reduce((o, key) => (o ? o[key] : undefined), obj);
};

export const convetToObject = (data) => {
  return JSON.parse(data);
};

export const buildQueryString = (params = {}) => {
  return Object.entries(params)
    .filter(
      // eslint-disable-next-line no-unused-vars
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value
          .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join("&");
};

export const removeKeysFromObject = (obj, keysToRemove) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
  );

export const areArraysEqual = (arr1, arr2) => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
};
export const pickKeys = (obj, keys) =>
  keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key];
    } else {
      acc[key] = null;
    }
    return acc;
  }, {});

export const sortObjectKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((result, key) => {
        result[key] = sortObjectKeys(obj[key]);
        return result;
      }, {});
  }
  return obj;
};

console.log(
  JSON.parse(
    JSON.stringify(
      'Based on your request for details about "Orange Hospital," here are the available records found:\n\n### Orange Hospital Details\n1. **Location:** Address, Ahmedabad  \n   **Email:** primary1@yopmail.com  \n   **Pincode:** 389551\n\n2. **Location:** idid Navsari  \n   **Email:** hospital@yopmail.com  \n   **Pincode:** 389519\n\n3. **Location:** Sola, Gota, Ahmedabad  \n   **Email:** orange@yopmail.com  \n   **Pincode:** 389519\n\n4. **Location:** L.D. College of Engineering, Ahmedabad  \n   **Email:** newnewnew@yopmail.com  \n   **Pincode:** 389519\n\nPlease note that phone numbers are not available for these entries.\n\nIf you need information on a specific branch or further details, feel free to ask.'
    )
  )
);
