import axios from "axios";


const APIService = async ({ question, onResponse, retries = 2 }) => {

  const makeRequest = async (attempt = 1) => {
    try {
      const response = await axios({
        url: "http://127.0.0.1:5000/generate",
        method: "POST",
        data: { question },
        timeout: 120000,
        headers: {
          "Content-Type": "application/json",
        },
      });


      if (response.status === 200 && response.data) {
        console.log(response)
        onResponse(response.data);
      }

    } catch (error) {
      console.error(`Attempt ${attempt} failed`, error);

      if (error.code === "ECONNABORTED" && attempt <= retries) {
        await new Promise(r => setTimeout(r, 2000));
        return makeRequest(attempt + 1);
      }

      onResponse({
        candidates: [{
          content: {
            parts: [{ text: "Server error. Please try again later." }]
          }
        }]
      });
    }
  };

  await makeRequest();
};

export default APIService;
