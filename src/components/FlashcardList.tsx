import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { flashcardService } from "@/services/flashcardService";

interface Flashcard {
  id: string;
  user_id: string;
  front: string;
  back: string;
  created_at: string;
}

interface FlashcardListProps {
  flashcards: Flashcard[];
  onDelete?: (id: string) => void;
}

export const FlashcardList: React.FC<FlashcardListProps> = ({
  flashcards,
  onDelete,
}) => {
  if (flashcards.length === 0) return null;

  const handleDelete = async (id: string) => {
    try {
      await flashcardService.deleteFlashcard(id);
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  return (
    <>
      <h2 className="text-center mb-5">
        <i className="bi-lightbulb-fill text-primary me-2"></i>
        Your Flashcards
      </h2>
      <Row className="g-4">
        {flashcards.map((card, index) => (
          <Col key={card.id} md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <Card.Title className="h4 text-primary mb-0">
                    <i className="bi-question-circle-fill text-primary me-2"></i>
                    Question {index + 1}
                  </Card.Title>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(card.id)}
                    className="ms-2"
                  >
                    <i className="bi-trash-fill"></i>
                  </Button>
                </div>
                <Card.Text className="mb-4">{card.front}</Card.Text>
                <Card.Title className="h4 text-success">
                  <i className="bi-lightbulb-fill text-success me-2"></i>
                  Answer
                </Card.Title>
                <Card.Text>{card.back}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};
