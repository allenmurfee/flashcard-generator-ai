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
  PencilIcon,
  ClipboardDocumentListIcon,
  BookmarkIcon,
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
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4 mb-4">
            <span className="icon-wrapper me-2">
              <AcademicCapIcon
                className="h-12 w-12"
                style={{ color: "var(--primary-color)" }}
              />
            </span>
            Flashcard AI Generator
          </h1>
          <p className="lead education-text">
            <span className="icon-wrapper me-2">
              <PencilIcon
                className="h-5 w-5"
                style={{ color: "var(--primary-color)" }}
              />
            </span>
            Transform your lecture notes into effective study flashcards
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form>
                <Form.Group className="mb-4">
                  <Form.Label className="h5">
                    <span className="icon-wrapper me-2">
                      <BookOpenIcon
                        className="h-5 w-5"
                        style={{ color: "var(--primary-color)" }}
                      />
                    </span>
                    Paste your lecture notes here
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter your lecture notes..."
                    className="border-2"
                  />
                </Form.Group>
                <div className="text-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={generateFlashcards}
                    disabled={loading}
                    className="px-5"
                  >
                    <span className="icon-wrapper me-2">
                      {loading ? (
                        <ClipboardDocumentListIcon
                          className="h-5 w-5"
                          style={{ color: "white" }}
                        />
                      ) : (
                        <BookmarkIcon
                          className="h-5 w-5"
                          style={{ color: "white" }}
                        />
                      )}
                    </span>
                    {loading ? "Generating..." : "Generate Flashcards"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col md={{ span: 8, offset: 2 }}>
            <Alert variant="danger" className="shadow-sm">
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {flashcards.length > 0 && (
        <Row>
          <Col>
            <h2 className="text-center mb-5">
              <span className="icon-wrapper me-2">
                <LightBulbIcon
                  className="h-6 w-6"
                  style={{ color: "var(--primary-color)" }}
                />
              </span>
              Your Flashcards
            </h2>
            <Row className="g-4">
              {flashcards.map((card, index) => (
                <Col key={index} md={6}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <Card.Title className="h4 text-primary">
                        <span className="icon-wrapper me-2">
                          <PencilIcon
                            className="h-5 w-5"
                            style={{ color: "var(--primary-color)" }}
                          />
                        </span>
                        Question {index + 1}
                      </Card.Title>
                      <Card.Text className="mb-4">{card.question}</Card.Text>
                      <Card.Title className="h4 text-success">
                        <span className="icon-wrapper me-2">
                          <LightBulbIcon
                            className="h-5 w-5"
                            style={{ color: "var(--success)" }}
                          />
                        </span>
                        Answer
                      </Card.Title>
                      <Card.Text>{card.answer}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}
    </Container>
  );
}
