import { ChatData } from "../app/app";

const apiKey = import.meta.env.VITE_API_KEY;
class API {
  constructor() {}
  async getVoices() {
    const url = `https://texttospeech.googleapis.com/v1/voices?key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      return data.voices;
    } catch (error) {
      console.error("Error fetching voice list:", error);
    }
  }

  config = async (jsonData: ChatData[]) => {
    try {
      const response = await fetch("http://localhost:3001/process-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error calling Text-to-Speech API:", error);
    }
  };
}

export const api = new API();
