import { number, object, string } from "yup";
import { Button } from "../../components/Button";
import { FormInput, FormSelect } from "../../components/FormInput";
import { useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { FormTextArea } from "../../components/FormInput";
import { useQuery } from "react-query";
import { getCategories } from "../../services/category";
import { createQuery } from "../../services/query";
const createRequestSchema = object().shape({
    title: string().required(),
    description: string().required(),
    categoryId: number().required().nonNullable(),
});

export function CreateRequestPage() {
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { data: categories } = useQuery("categories", getCategories, {
        initialData: []
    });
    return (
        <>
            <Formik
                initialValues={{
                    title: '',
                    description: '',
                    categoryId: 0
                }}
                validationSchema={createRequestSchema}
                onSubmit={async (values) => {
                    setError("");
                    return createQuery({
                        ...values,
                        categoryId: Number.parseInt(values.categoryId.toString()),
                    }).then(() => {
                        return navigate("/dashboard")
                    }).catch((err) => {
                        setError(err.message)
                    })
                }}
            >
                {({ isSubmitting, isValid, values, setFieldValue }) => (
                    <Form>
                        {error != "" && <Alert message={error} type="warning" />}
                        <FormInput label="Request" name="title" />
                        <FormTextArea label="Description" name="description" />
                        <FormSelect value={values.categoryId} label="Category" name="categoryId" >
                            {
                                ([null, ...(categories ?? [])]).map((e) => e == null ? <option value="0" key={"0"} disabled>Select a category</option> : <option key={e.ID} value={e.ID}>{e.name}</option>)
                            }
                        </FormSelect>
                        <div className="form-control mt-6">
                            <Button loading={isSubmitting} disabled={!isValid || isSubmitting} >Save</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}
