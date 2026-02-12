import { ChangeEvent } from "react";
import { IntakeFormData } from "@/types/emergencyLeakService";
import { FormTextarea } from "@/components/emergencyLeakService/FormInput";

type AdditionalNotesSectionProps = {
  additionalNotes: IntakeFormData["additionalNotes"];
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function AdditionalNotesSection({
  additionalNotes,
  onChange,
}: AdditionalNotesSectionProps) {
  return (
    <section className="rounded-lg border border-slate-300 p-4">
      <h2 className="text-lg font-bold text-slate-900">Additional Notes</h2>
      <FormTextarea
        id="additionalNotes"
        label="Message"
        value={additionalNotes}
        onChange={onChange}
        className="mt-4 flex flex-col gap-2 text-sm font-semibold text-slate-800"
      />
    </section>
  );
}
