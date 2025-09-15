export function cleanFormData(data = {}, fields = null) {
  const cleanedData = {};
  Object.keys(data).forEach((key) => {
    if (fields != null && !fields.includes(key)) {
      return;
    }
    if (typeof data[key] === 'string') {
        cleanedData[key] = data[key].trim();
    } else {
      cleanedData[key] = data[key];
    }
  });
  return cleanedData;
}