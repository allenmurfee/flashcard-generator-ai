"use client";

import { Container } from "react-bootstrap";
import { Header } from "@/components/Header";
import { NotesInput } from "@/components/NotesInput";
import { ErrorAlert } from "@/components/ErrorAlert";
import { FlashcardList } from "@/components/FlashcardList";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { flashcardService } from "@/services/flashcardService";
import LoginScreen from "@/components/LoginScreen";

interface Flashcard {
  id: string;
  user_id: string;
  front: string;
  back: string;
  created_at: string;
}

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadFlashcards();
    }
  }, [user]);

  const loadFlashcards = async () => {
    try {
      const userFlashcards = await flashcardService.getUserFlashcards(
        user?.id || ""
      );
      setFlashcards(userFlashcards);
    } catch (err) {
      setError("Failed to load flashcards");
      console.error(err);
    }
  };

  const handleDelete = (deletedId: string) => {
    setFlashcards((currentFlashcards) =>
      currentFlashcards.filter((card) => card.id !== deletedId)
    );
  };

  if (authLoading) {
    return (
      <Container className="py-5">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Container>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <Container className="py-5">
      <Header onLogout={signOut} />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="mt-4">
            <NotesInput onSuccess={loadFlashcards} />
          </div>
        </div>
      </div>
      <ErrorAlert error={error || ""} />
      <FlashcardList flashcards={flashcards} onDelete={handleDelete} />
    </Container>
  );
}
