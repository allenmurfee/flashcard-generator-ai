"use client";

import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Header } from "@/components/Header";
import { NotesInput } from "@/components/NotesInput";
import { FlashcardList } from "@/components/FlashcardList";
import { ErrorAlert } from "@/components/ErrorAlert";
import { useAuth } from "@/hooks/useAuth";
import LoginScreen from "@/components/LoginScreen";
import { supabase } from "@/lib/supabase";

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
      fetchFlashcards();
    }
  }, [user]);

  const fetchFlashcards = async () => {
    try {
      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFlashcards(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch flashcards"
      );
    }
  };

  const handleGenerateFlashcards = async (notes: string) => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate flashcards");
      }

      if (!data.flashcards || !Array.isArray(data.flashcards)) {
        throw new Error("Invalid response format from API");
      }

      const newFlashcards = data.flashcards.map(
        (card: { question: string; answer: string }) => ({
          user_id: user?.id,
          front: card.question,
          back: card.answer,
          created_at: new Date().toISOString(),
        })
      );

      // Save to Supabase
      const { error } = await supabase.from("flashcards").insert(newFlashcards);

      if (error) throw error;

      // Update local state
      setFlashcards([...newFlashcards, ...flashcards]);
    } catch (err) {
      console.error("Error details:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate flashcards"
      );
      throw err;
    }
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
      <Row className="mb-5">
        <Col md={{ span: 8, offset: 2 }}>
          <NotesInput onGenerateClick={handleGenerateFlashcards} />
        </Col>
      </Row>
      <ErrorAlert error={error || ""} />
      <FlashcardList flashcards={flashcards} />
    </Container>
  );
}
