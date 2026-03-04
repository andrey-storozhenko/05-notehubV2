import css from "./NoteForm.module.css"
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import type { NoteFormValues } from "../../types/note";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";

const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: ""
};

interface NoteFormProps{
     onClose: () => void;
}

const NoteFormSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Title must be at least 3 characters")
        .max(50, "Title is too long")
        .required("Username is required"),
    content: Yup.string().max(500, "Content is too long"),
    tag: Yup.string()
        .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
        .required("Select tag")
});


export default function NoteForm({ onClose }: NoteFormProps) {
    const queryClient = useQueryClient();

    const createNoteMutation = useMutation({
            mutationFn: async (values: NoteFormValues) => {
                await createNote(values);
            },
            onSuccess: () => {
                console.log("Note added successfully");
                queryClient.invalidateQueries({ queryKey: ["notes"] });
                onClose();
            }
        });
    
    
    const handleSubmit = (values: NoteFormValues, actions: FormikHelpers<NoteFormValues>) => {
        createNoteMutation.mutate(values);
        actions.resetForm();
    }

    return (
        <Formik initialValues={initialValues} validationSchema={NoteFormSchema} onSubmit={handleSubmit}>
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor="title">Title</label>
                    <Field id="title" type="text" name="title" className={css.input} />
                    <ErrorMessage name="title" component="span" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="content">Content</label>
                    <Field as="textarea"
                    id="content"
                    name="content"
                    rows={8}
                    className={css.textarea}
                    />
                    <ErrorMessage name="content" component="span" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="tag">Tag</label>
                    <Field as="select" id="tag" name="tag" className={css.select}>
                    <option value="">Select a tag</option>
                    <option value="Todo">Todo</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage name="tag" component="span" className={css.error} />
                    <span className={css.error} />
                </div>

                <div className={css.actions}>
                    <button type="button" onClick={onClose} className={css.cancelButton}>
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className={css.submitButton}
                    disabled={false}
                    >
                    Create note
                    </button>
                </div>
            </Form>
        </Formik>
    );
}