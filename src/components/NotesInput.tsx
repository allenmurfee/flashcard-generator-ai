import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useAuth } from "@/hooks/useAuth";
import { flashcardService } from "@/services/flashcardService";

interface NotesInputProps {
  onSuccess?: () => void;
}

export const NotesInput: React.FC<NotesInputProps> = ({ onSuccess }) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const generateFlashcards = async () => {
    if (!notes.trim()) {
      setError("Please enter some notes to generate flashcards");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Sending request to /api/generate with notes:", notes);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        // Handle different types of errors
        const errorType = data.type || "unknown";
        const errorDetails = data.details || data.error || "Unknown error";

        console.error("API Error:", {
          type: errorType,
          details: errorDetails,
          fullResponse: data,
        });

        switch (errorType) {
          case "api_error":
            throw new Error(`API Error: ${errorDetails}`);
          case "parse_error":
            throw new Error(`Failed to parse response: ${errorDetails}`);
          default:
            throw new Error(errorDetails);
        }
      }

      if (!data.flashcards || !Array.isArray(data.flashcards)) {
        console.error("Invalid flashcards data:", data);
        throw new Error("Invalid response format from server");
      }

      if (!user?.id) {
        throw new Error("You must be logged in to save flashcards");
      }

      // Add user_id to each flashcard and map question/answer to front/back
      const flashcardsWithUserId = data.flashcards.map(
        (flashcard: { question: string; answer: string }) => ({
          front: flashcard.question,
          back: flashcard.answer,
          user_id: user.id,
        })
      );

      // Save flashcards to Supabase
      await flashcardService.saveFlashcards(flashcardsWithUserId);

      // Clear the input
      setNotes("");

      // Show success message
      setError("Flashcards generated and saved successfully!");

      // Call the onSuccess callback to refresh the list
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      console.error("Error generating flashcards:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form>
          <Form.Group className="mb-4">
            <Form.Label className="h5">
              <i className="bi-journal-text text-primary me-2"></i>
              Paste your lecture notes here
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNotes(e.target.value)
              }
              placeholder="Enter your lecture notes..."
              className="border-2"
            />
          </Form.Group>
          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={generateFlashcards}
              disabled={loading || !user}
              className="px-5"
            >
              <i
                className={`bi-${
                  loading ? "clipboard-check" : "bookmark"
                } me-2`}
              ></i>
              {loading ? "Generating..." : "Generate Flashcards"}
            </Button>
          </div>
          {error && (
            <div
              className={`mt-3 text-center ${
                error.includes("successfully") ? "text-success" : "text-danger"
              }`}
            >
              {error}
            </div>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};
