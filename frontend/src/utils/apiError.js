const extractApiError = (err, fallback = "Request failed") => {
  const data = err?.response?.data;
  if (!data) {
    return fallback;
  }

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors[0].msg || fallback;
  }

  return data.message || fallback;
};

export default extractApiError;
