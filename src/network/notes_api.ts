import { Note } from "../models/note";
import { User } from "../models/user";
import { getApi } from "./api";

//USER ROUTES

//NOTES ROUTES
export async function fetchNotes(): Promise<Note[]> {
  const response = await getApi().get("/api/notes", { withCredentials: true });
  return response.data;
}

export interface NoteInput {
  title: string;
  text?: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
  const response = await getApi().post("/api/notes", note);
  return response.data;
}

export async function updateNote(
  noteId: string,
  note: NoteInput
): Promise<Note> {
  const response = await getApi().patch(`/api/notes/${noteId}`, note);
  return response.data;
}

export async function deleteNote(noteId: string) {
  await getApi().delete(`/api/notes/${noteId}`);
}
