import { supabase } from "@/lib/supabase";
import { Flashcard } from "@/types/database.types";

export const flashcardService = {
  // Create a new flashcard
  async createFlashcard(flashcard: Omit<Flashcard, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("flashcards")
      .insert([flashcard])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all flashcards for a user
  async getUserFlashcards(userId: string) {
    const { data, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update a flashcard
  async updateFlashcard(id: string, updates: Partial<Flashcard>) {
    const { data, error } = await supabase
      .from("flashcards")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a flashcard
  async deleteFlashcard(id: string) {
    const { error } = await supabase.from("flashcards").delete().eq("id", id);

    if (error) throw error;
  },

  // Save multiple flashcards
  async saveFlashcards(flashcards: Omit<Flashcard, "id" | "created_at">[]) {
    const { data, error } = await supabase
      .from("flashcards")
      .insert(flashcards)
      .select();

    if (error) throw error;
    return data;
  },
};
