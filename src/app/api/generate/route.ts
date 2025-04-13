import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { notes } = await request.json();

    if (!notes) {
      return NextResponse.json(
        { error: "Notes are required" },
        { status: 400 }
      );
    }

    const prompt = `Create 5 flashcards from the following lecture notes. For each flashcard, provide a question and a detailed answer. Format the response as a JSON array of objects with 'question' and 'answer' properties. Notes: ${notes}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful study assistant that creates effective flashcards from lecture notes. Create clear, concise questions and detailed answers that cover the key concepts.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    // Parse the JSON response
    const flashcards = JSON.parse(content);

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
