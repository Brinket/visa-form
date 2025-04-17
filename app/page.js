"use client";

import { useState, useEffect } from "react";
import GeneratedForm from "@/components/GeneratedForm";

export default function Page() {
  const [formTemplate, setFormTemplate] = useState([]);
  const [creating, setCreating] = useState(false);
  const [formLink, setFormLink] = useState("");

  useEffect(() => {
    async function fetchFormTemplate() {
      const response = await fetch("/json/Schengen_Spain_Kaz.json");
      const data = await response.json();
      setFormTemplate(data);
    }

    fetchFormTemplate();
  }, []);

  async function createTypeform() {
    setCreating(true);

    const fields = formTemplate.map(field => {
      let type = "short_text"; // стандартный тип поля
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
        Authorization: `Bearer tfp_DD9LNn6TCxERHs9UqAXn2NozQLKjP9vYxziDcN2qWYVY_e5NUNpEzP3M4`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.id) {
      setFormLink(`https://form.typeform.com/to/${result.id}`);
    }

    setCreating(false);
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Форма анкеты на визу в Испанию</h1>

      {formTemplate.length > 0 ? (
        <GeneratedForm formSchema={formTemplate} />
      ) : (
        <p>Загрузка формы...</p>
      )}

      <button
        onClick={createTypeform}
        className="bg-green-500 text-white px-4 py-2 rounded mt-6"
        disabled={creating}
      >
        {creating ? "Создание формы..." : "Создать форму в Typeform"}
      </button>

      {formLink && (
        <div className="mt-4">
          <a
            href={formLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Перейти к созданной форме
          </a>
        </div>
      )}
    </div>
  );
}
