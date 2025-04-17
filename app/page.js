"use client";

import { useState, useEffect } from "react";
import GeneratedForm from "@/components/GeneratedForm";

export default function Page() {
  const [formTemplate, setFormTemplate] = useState([]);
  const [creating, setCreating] = useState(false);
  const [formLink, setFormLink] = useState("");

  useEffect(() => {
    async function fetchFormTemplate() {
      const response = await fetch("/json/SchengenVisaForm.json");
      const data = await response.json();
      setFormTemplate(data);
    }

    fetchFormTemplate();
  }, []);

  async function createTypeform() {
    setCreating(true);

    const response = await fetch("/api/create-typeform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formTemplate })
    });

    const result = await response.json();

    if (result._links && result._links.display) {
      setFormLink(result._links.display);
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
          <p className="text-green-600 font-semibold">Форма успешно создана!</p>
          <a
            href={formLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Перейти к форме Typeform
          </a>
        </div>
      )}
    </div>
  );
}
