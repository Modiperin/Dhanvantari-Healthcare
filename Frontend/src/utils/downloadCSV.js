const flattenObject = (obj, prefix = "") => {
  let res = {};

  for (let key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const nested = flattenObject(value, newKey);
      res = { ...res, ...nested };
    } else if (Array.isArray(value)) {
      // res[newKey] = value.join(", "); // or JSON.stringify(value) if preferred
      res[newKey] = JSON.stringify(value)
    } else {
      res[newKey] = value;
    }
  }

  return res;
};

const removeObjectForDownload = (keysToRemove, data) => {

  const newArrayOfObjects = data?.map((obj) => {
    const newObj = { ...obj }; // Create a shallow copy of the object
    keysToRemove.forEach((key) => {
      delete newObj[key]; // Delete the specified key from the copy
    });
    return newObj;
  });
  return newArrayOfObjects;
};

export const downloadCSV = ({ data, fileName = "data.csv", keysToRemove = [] }) => {
  console.log(data);
  let flattenedData = data?.map((row) => flattenObject(row));
  if (keysToRemove)
    flattenedData = removeObjectForDownload(keysToRemove, flattenedData)

  // Step 2: Get all unique fields (keys)
  const allFields = Array.from(
    new Set(flattenedData.flatMap((row) => Object.keys(row)))
  );

  // Step 3: Construct CSV rows
  const csvRows = [];

  // Header
  csvRows.push(allFields.join(","));

  // Data rows
  flattenedData.forEach((row) => {
    const values = allFields.map((field) => {
      let val = row[field];
      if (val === undefined || val === null) return "";
      // Escape double quotes and wrap in quotes if needed
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    });
    csvRows.push(values.join(","));
  });



  // Step 4: Create and download the file
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
