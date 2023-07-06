const axios = require("axios");
async function validateUrl(url) {
  try {
    const response = await axios.get(url);

    if (response.status >= 200 && response.status < 300) {
      return true; // URL is valid and links to a source
    } else {
      return false; // URL is valid, but the source is not accessible
    }
  } catch (error) {
    if (error.response) {
      // Error response received from the server
      if (error.response.status === 401) {
        throw new Error("Authentication required to access the resource.");
      }
    } else {
      // Other types of errors
      throw new Error("Invalid URL or poor internet connection.");
    }
  }
}

module.exports = validateUrl;
