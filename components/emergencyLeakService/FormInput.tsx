import { ChangeEvent } from "react";

type FormInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: "text" | "email";
};

export function FormInput({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
}: FormInputProps) {
  return (
    <label
      className="flex flex-col gap-2 text-sm font-semibold text-slate-800"
      htmlFor={id}
    >
      {label}
      <input
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        type={type}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
      />
      {error ? (
        <span className="text-xs font-medium text-red-600">{error}</span>
      ) : null}
    </label>
  );
}

type FormTextareaProps = {
  id: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  className?: string;
};

export function FormTextarea({
  id,
  label,
  value,
  onChange,
  error,
  className,
}: FormTextareaProps) {
  return (
    <label
      className={
        className ?? "flex flex-col gap-2 text-sm font-semibold text-slate-800"
      }
      htmlFor={id}
    >
      {label}
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
      />
      {error ? (
        <span className="text-xs font-medium text-red-600">{error}</span>
      ) : null}
    </label>
  );
}
