"use client";

import { useState } from "react";
import EditableFormTable from "@/components/EditableFormTable";

export default function Page() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formLink, setFormLink] = useState(""); 
  const [publishing, setPublishing] = useState(false);

  async function createDraftForm() {
    setLoading(true);
    setError("");
    setFormFields([]);
    setFormLink("");
  
    try {
      const response = await fetch("/api/create-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: pdfUrl })
      });
  
      const responseText = await response.text();
      console.log("Сырые данные перед парсингом:", responseText);
  
      if (!response.ok) {
        console.error("Ошибка HTTP запроса:", response.status, response.statusText);
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
  
      if (!responseText) {
        throw new Error("Пустой ответ от сервера.");
      }
  
      const result = JSON.parse(responseText);
      console.log("Распарсенный JSON:", result);
  
      // Извлекаем массив из поля `fields`
      const fields = result.fields || [];
      console.log("Поля fields перед фильтрацией:", fields);
  
      if (!Array.isArray(fields) || fields.length === 0) {
        throw new Error("Ответ сервера не содержит ожидаемых данных.");
      }
  
      // Фильтруем только нужные типы
      const allowedTypes = ["text", "date"];
      const filteredFields = fields.filter(field => allowedTypes.includes(field.type));
      console.log("Фильтрованные поля:", filteredFields);
  
      if (filteredFields.length === 0) {
        throw new Error("Нет полей с допустимыми типами.");
      }
  
      // Обновляем состояние
      setFormFields(filteredFields);
      console.log("Обновленные formFields:", filteredFields);
    } catch (err) {
      console.error("Ошибка запроса или обработки:", err.message || err);
      setError("Ошибка при соединении с сервером или обработке ответа.");
      setFormFields([]);
      setFormLink("");
    } finally {
      setLoading(false);
    }
  }

  async function publishForm() {
    setPublishing(true);
    setError("");

    try {
      const response = await fetch("/api/create-typeform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: formFields })
      });

      const result = await response.json();

      if (result._links?.display) {
        setFormLink(result._links.display);
      } else {
        throw new Error(`Ошибка создания формы в Typeform. Ответ сервера: ${JSON.stringify(result)}`);
      }
    } catch (err) {
      setError("Ошибка при публикации формы в Typeform.");
      console.error(err);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Создание черновика формы</h1>

      <input
        type="text"
        placeholder="Вставьте ссылку на PDF-файл с требованиями"
        value={pdfUrl}
        onChange={(e) => setPdfUrl(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={createDraftForm}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={!pdfUrl || loading}
      >
        {loading ? "Создание черновика..." : "Создать черновик формы"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {formFields.length > 0 && (
        <div className="mt-10 space-y-6">
          <h2 className="text-xl font-semibold">Редактирование формы</h2>
          <EditableFormTable
            key={JSON.stringify(formFields)}
            initialFields={formFields}
            setFields={setFormFields}
          />

          <button
            onClick={publishForm}
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={publishing}
          >
            {publishing ? "Публикация формы..." : "Опубликовать форму"}
          </button>
        </div>
      )}

      {formLink && (
        <div className="mt-6">
          <p className="text-green-600 font-semibold mb-2">Форма успешно создана!</p>
          <a href={formLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Перейти к форме Typeform
          </a>
        </div>
      )}
    </div>
  );
}
