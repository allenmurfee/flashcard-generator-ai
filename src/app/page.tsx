"use client";

import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import {
  AcademicCapIcon,
  BookOpenIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const [notes, setNotes] = useState("");
  const [flashcards, setFlashcards] = useState<
    Array<{ question: string; answer: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateFlashcards = async () => {
    if (!notes.trim()) {
      setError("Please enter your lecture notes");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data.flashcards);
    } catch (err) {
      setError("An error occurred while generating flashcards");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4 mb-3">
            <AcademicCapIcon className="h-12 w-12 inline-block mr-2" />
            Flashcard Generator AI
          </h1>
          <p className="lead">
            Transform your lecture notes into effective study flashcards
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <BookOpenIcon className="h-5 w-5 inline-block mr-2" />
                Paste your lecture notes here
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your lecture notes..."
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={generateFlashcards}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Flashcards"}
            </Button>
          </Form>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {flashcards.length > 0 && (
        <Row>
          <Col>
            <h2 className="mb-4">
              <LightBulbIcon className="h-6 w-6 inline-block mr-2" />
              Your Flashcards
            </h2>
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {flashcards.map((card, index) => (
                <Col key={index}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>Question {index + 1}</Card.Title>
                      <Card.Text className="mb-3">{card.question}</Card.Text>
                      <Card.Title>Answer</Card.Title>
                      <Card.Text>{card.answer}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}
