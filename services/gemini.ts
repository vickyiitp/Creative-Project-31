import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMoleculeFact = async (moleculeName: string, formula: string): Promise<string> => {
  try {
    // Using simple string format for contents significantly reduces RPC serialization errors
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Tell me a fascinating, brief scientific fact (max 2 sentences) about the molecule ${moleculeName} (${formula}). Focus on its role in nature or industry.`,
    });
    return response.text?.trim() ?? "No fact available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not retrieve molecule data at this time.";
  }
};

export const getChemistryHint = async (element1: string, element2: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Explain in one short sentence why bonding ${element1} and ${element2} might be tricky or what their valence electron counts are.`,
    });
    return response.text?.trim() ?? "Check the number of free connections available on each atom.";
  } catch (error) {
    console.error("Gemini Hint Error:", error);
    return "Check the number of free connections available on each atom.";
  }
};