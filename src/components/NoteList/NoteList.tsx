import css from "./NoteList.module.css"
import type { Note } from "../../types/note";

interface NoteListProps{
    notes: Note[];
    onClick: (id: string) => void;
}

export default function NoteList({ notes, onClick }: NoteListProps) { 
    const handleDelete = (id: string) => {
        onClick(id);
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