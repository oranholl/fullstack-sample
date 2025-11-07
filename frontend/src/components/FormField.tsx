interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function FormField({ label, required = false, children }: FormFieldProps) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && "*"}
      </label>
      {children}
    </div>
  );
}
