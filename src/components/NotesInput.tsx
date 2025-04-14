import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useAuth } from "@/hooks/useAuth";

interface NotesInputProps {
  onGenerateClick: (notes: string) => Promise<void>;
}

export const NotesInput: React.FC<NotesInputProps> = ({ onGenerateClick }) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleGenerate = async () => {
    if (!notes.trim()) {
      setError("Please enter your lecture notes");
      return;
    }

    if (!user) {
      setError("Please sign in to save flashcards");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onGenerateClick(notes);
      setNotes(""); // Clear the input after successful generation
    } catch (err) {
      setError("An error occurred while generating flashcards");
      console.error(err);
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
              onClick={handleGenerate}
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
          {error && <div className="mt-3 text-danger text-center">{error}</div>}
        </Form>
      </Card.Body>
    </Card>
  );
};
