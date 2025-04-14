import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { notes } = await request.json();
    console.log("Received notes length:", notes?.length);

    if (!notes) {
      console.log("No notes provided");
      return NextResponse.json(
        { error: "Notes are required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    console.log("Making OpenAI API call...");
    const prompt = `Create 5 flashcards from the following lecture notes. For each flashcard, provide a question and a detailed answer. Format the response as a JSON array of objects with 'question' and 'answer' properties. Notes: ${notes}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful study assistant that creates effective flashcards from lecture notes. Create clear, concise questions and detailed answers that cover the key concepts. Always return a valid JSON array of objects with 'question' and 'answer' properties.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    console.log("OpenAI API call completed");
    const content = completion.choices[0].message.content;
    if (!content) {
      console.error("No content in OpenAI response");
      throw new Error("No content received from OpenAI");
    }

    console.log("OpenAI response content:", content);

    // Parse the JSON response
    let flashcards;
    try {
      flashcards = JSON.parse(content);
      console.log("Successfully parsed flashcards:", flashcards.length);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", content);
      throw new Error("Invalid response format from OpenAI");
    }

    if (!Array.isArray(flashcards)) {
      console.error("Flashcards is not an array:", flashcards);
      throw new Error("OpenAI response is not an array");
    }

    // Validate each flashcard has the required properties
    const validFlashcards = flashcards.every(
      (card) => card.question && card.answer
    );
    if (!validFlashcards) {
      console.error("Invalid flashcard format:", flashcards);
      throw new Error("Invalid flashcard format in OpenAI response");
    }

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate flashcards",
      },
      { status: 500 }
    );
  }
}
