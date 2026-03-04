import {useState } from "react";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {fetchNotes} from "../../services/noteService";
import { useDebouncedCallback } from 'use-debounce';
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";

export default function App() {

    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    const { data, isFetching } = useQuery({
        queryKey: ["notes", searchQuery, page],
        queryFn: () => fetchNotes(searchQuery, page),
        placeholderData: keepPreviousData,
    })

    const updateSearchQuery = useDebouncedCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => { 
            setSearchQuery(e.target.value);
            setPage(1);
        },300
    );
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => setIsModalOpen(false);



    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox query={searchQuery} updateSearchQuery={updateSearchQuery}></SearchBox>
                {(data?.totalPages ?? 0) > 1 && <Pagination
                    pageCount={data?.totalPages ?? 0}
                    currentPage={page - 1}
                    onPageChange={(newPage) => setPage(newPage)}
                />}
               

               <button className={css.button} onClick={openModal}>Create note +</button>
            </header>
            {isFetching && <div>Loading notes...</div>}
            <NoteList notes={data?.notes ?? []}></NoteList>
            {isModalOpen && <Modal onClose={closeModal}><NoteForm onClose={closeModal}></NoteForm></Modal>}
        </div>
    );
}