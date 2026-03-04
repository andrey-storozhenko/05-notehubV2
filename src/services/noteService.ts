import axios from 'axios';
import type { Note } from "../types/note";
import type { NoteFormValues } from '../types/note';

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;

interface FetchNotesResponse{
    notes: Note[];
    totalPages: number;
}

export const fetchNotes = async (title:string, page:number):Promise<FetchNotesResponse> => {
    const response = await axios.get<FetchNotesResponse>("https://notehub-public.goit.study/api/notes", {
         params: {
            search: title,
            page: page,
            perPage: 10,
            sortBy: "created"
      },
        headers: {

            Authorization: `Bearer ${myKey}`,
        }
    });
    return response.data;
}


export const createNote = async ({ title, content, tag }: NoteFormValues):Promise<Note> => {
    const response = await axios.post("https://notehub-public.goit.study/api/notes",
        {
            title: title,
            content: content,
            tag: tag
        },
        {
        headers: {
            Authorization: `Bearer ${myKey}`,
        }
        }
       
    );
    return response.data;
}

export const deleteNote = async (id: string):Promise<Note> => {
    const response = await axios.delete(`https://notehub-public.goit.study/api/notes/${id}`, {
        headers: {
            Authorization: `Bearer ${myKey}`,
        }
    });
    return response.data;
}