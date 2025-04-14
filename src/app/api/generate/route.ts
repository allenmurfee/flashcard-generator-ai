import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""
);

export async function POST(request: Request) {
  try {
    const { notes } = await request.json();
    console.log("Received notes:", notes);

    if (!notes) {
      return NextResponse.json(
        { error: "Notes are required" },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Google API key is not configured" },
        { status: 500 }
      );
    }

    // Get the Gemini model with correct configuration
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
      },
    });

    const prompt = `Create exactly 3 flashcards from these notes. Each flashcard should have a clear question and answer.
    Return ONLY a valid JSON array in this exact format:
    [
      {"question": "What is...", "answer": "It is..."},
      {"question": "What is...", "answer": "It is..."},
      {"question": "What is...", "answer": "It is..."}
    ]
    
    Notes: ${notes.substring(0, 500)}`;

    console.log("Sending prompt to Gemini:", prompt);

    let result;
    try {
      result = await model.generateContent(prompt);
      console.log("Got result from Gemini");
    } catch (apiError: unknown) {
      console.error("Gemini API error:", apiError);
      const errorMessage =
        apiError instanceof Error ? apiError.message : "Unknown API error";
      return NextResponse.json(
        {
          error: "Failed to generate flashcards",
          details: `API Error: ${errorMessage}`,
          type: "api_error",
        },
        { status: 500 }
      );
    }

    const response = await result.response;
    const text = response.text();
    console.log("Raw Gemini response:", text);
    console.log("Response type:", typeof text);
    console.log("Response length:", text.length);

    // Try to parse the JSON response
    let flashcards;
    try {
      // First, try to find the JSON array in the response
      const jsonMatch = text.match(/\[[\s\S]*\{[\s\S]*\}[\s\S]*\]/);
      console.log("JSON match result:", jsonMatch ? "Found" : "Not found");

      if (jsonMatch) {
        console.log("Found JSON array in response");
        flashcards = JSON.parse(jsonMatch[0]);
      } else {
        console.log("No JSON array found, trying to parse entire response");
        flashcards = JSON.parse(text);
      }

      // Validate the flashcards structure
      if (!Array.isArray(flashcards) || flashcards.length !== 3) {
        throw new Error("Invalid number of flashcards");
      }

      for (const card of flashcards) {
        if (!card.question || !card.answer) {
          throw new Error("Invalid flashcard format");
        }
      }

      console.log(
        "Successfully parsed flashcards:",
        JSON.stringify(flashcards, null, 2)
      );
    } catch (parseError: unknown) {
      console.error("Failed to parse response:", text);
      console.error("Parse error details:", parseError);
      const errorMessage =
        parseError instanceof Error
          ? parseError.message
          : "Unknown parsing error";
      return NextResponse.json(
        {
          error: "Failed to parse flashcards",
          details: `Parsing Error: ${errorMessage}`,
          rawResponse: text,
          type: "parse_error",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ flashcards });
  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: errorMessage,
        type: "unexpected_error",
      },
      { status: 500 }
    );
  }
}
