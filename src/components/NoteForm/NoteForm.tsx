import css from "./NoteForm.module.css"
import { Field, Form, Formik, type FormikHelpers } from "formik";
import type { NoteFormValues } from "../../types/note";


const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: ""
};

interface NoteFormProps{
    onSubmit : (values: NoteFormValues) => void;
}

export default function NoteForm({ onSubmit }: NoteFormProps) {
    const handleSubmit = (values: NoteFormValues, actions: FormikHelpers<NoteFormValues>) => {
        onSubmit(values);
        actions.resetForm();
    }

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor="title">Title</label>
                    <Field id="title" type="text" name="title" className={css.input} />
                    <span className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="content">Content</label>
                    <Field as="textarea"
                    id="content"
                    name="content"
                    rows={8}
                    className={css.textarea}
                    />
                    <span className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="tag">Tag</label>
                    <Field as="select" id="tag" name="tag" className={css.select}>
                    <option value="Todo">Todo</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Shopping">Shopping</option>
                    </Field>
                    <span className={css.error} />
                </div>

                <div className={css.actions}>
                    <button type="button" className={css.cancelButton}>
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