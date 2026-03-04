import {useState } from "react";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css"
import ReactPaginate from 'react-paginate';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {createNote, deleteNote, fetchNotes} from "../../services/noteService";
import { useDebouncedCallback } from 'use-debounce';
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import type { NoteFormValues } from "../../types/note";

export default function App() {

    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    const { data, isFetching } = useQuery({
        queryKey: ["notes", searchQuery, page],
        queryFn: () => fetchNotes(searchQuery, page),
        placeholderData: keepPreviousData,
    })

    const updateSearchQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    300
    );
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => setIsModalOpen(false);

     const queryClient = useQueryClient();

    const createNoteMutation = useMutation({
        mutationFn: async (newNote: NoteFormValues) => {
            await createNote(newNote);
        },
        onSuccess: () => {
            console.log("Note added successfully");
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        }
    });

    const handleCreateNote = (values: NoteFormValues) => {
        createNoteMutation.mutate(values);
    }

    const deleteNoteMutation = useMutation({
        mutationFn: async (id: string) => {
            await deleteNote(id);
        },
        onSuccess: () => {
            console.log("Note deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        }
    });

     const handleDeleteNote = (id:string) => {
        deleteNoteMutation.mutate(id);
    }
        

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox query={searchQuery} updateSearchQuery={updateSearchQuery}></SearchBox>
                {(data?.totalPages ?? 0) > 1 && <ReactPaginate
                    pageCount={data?.totalPages ?? 0}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    onPageChange={({ selected }) => setPage(selected + 1)}
                    forcePage={page - 1}
                    containerClassName={css.pagination}
                    activeClassName={css.active}
                    nextLabel="→"
                    previousLabel="←"
                />}
               

               <button className={css.button} onClick={openModal}>Create note +</button>
            </header>
            {isFetching && <div>Loading notes...</div>}
            <NoteList notes={data?.notes ?? []} onClick={handleDeleteNote}></NoteList>
            {isModalOpen && <Modal onClose={closeModal}><NoteForm onSubmit={handleCreateNote}></NoteForm></Modal>}
        </div>
    );
}