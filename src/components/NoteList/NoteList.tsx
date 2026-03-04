import css from "./NoteList.module.css"
import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";

interface NoteListProps{
    notes: Note[];
}



export default function NoteList({ notes}: NoteListProps) { 

    const queryClient = useQueryClient();
    const deleteNoteMutation = useMutation({
        mutationFn: async (id: string) => {
            await deleteNote(id);
        },
        onSuccess: () => {
            console.log("Note deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        }
    });
    
    const handleDelete = (id: string) => {
        deleteNoteMutation.mutate(id);
    }

    return (
        <ul className={css.list}>
            {notes.map(({id,title, content,tag}) => (
                <li key={id} className={css.listItem}>
                    <h2 className={css.title}>{title}</h2>
                    <p className={css.content}>{content }</p>
                    <div className={css.footer}>
                    <span className={css.tag}>{tag}</span>
                    <button className={css.button} onClick={() => handleDelete(id)}>Delete</button>
                    </div>
                </li>
            ))}
           
        </ul>
    );
}