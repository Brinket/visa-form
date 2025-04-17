import { NextResponse } from "next/server";

export async function POST(request) {
  const { formTemplate } = await request.json();

  const fields = formTemplate.map(field => {
    let type = "short_text";
    if (field.type === "date") type = "date";
    if (field.type === "file_upload") type = "file_upload";

    return {
      title: field.label,
      type: type,
      validations: {
        required: field.required || false
      }
    };
  });

  const payload = {
    title: "Форма на визу в Испанию",
    fields: fields
  };

  const response = await fetch("https://api.typeform.com/forms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TYPEFORM_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  return NextResponse.json(result);
}
