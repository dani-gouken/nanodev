import { ErrorMessage, Field } from "formik";
import { PropsWithChildren } from "react";
type FormInputProps = {
    label: string,
    name: string,
    type?: string,
    placeholder?: string,
    value?: any
}
export function FormInput({ label, name, type = "text", placeholder }: FormInputProps) {
    return (<div className="form-control">
        <label className="label">
            <span className="label-text">{label}</span>
        </label>
        <Field name={name} type={type} placeholder={placeholder ?? label} className="input input-bordered" />
        <ErrorMessage component="p" className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1" name={name} />
    </div>)
}

export function FormTextArea({ label, name, type = "text", placeholder }: FormInputProps) {
    return (<div className="form-control">
        <label className="label">
            <span className="label-text">{label}</span>
        </label>
        <Field as="textarea" name={name} type={type} placeholder={placeholder ?? label} className="textarea textarea-bordered h-24" />
        <ErrorMessage component="p" className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1" name={name} />
    </div>)
}

export function FormSelect({ label, name, type = "text", placeholder, children, value }: PropsWithChildren<FormInputProps>) {
    return (<div className="form-control">
        <label className="label">
            <span className="label-text">{label}</span>
        </label>
        <Field value={value} as="select" name={name} type={type} placeholder={placeholder ?? label} className="select select-bordered">
            {children}
        </Field>
        <ErrorMessage component="p" className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1" name={name} />
    </div>)
}
