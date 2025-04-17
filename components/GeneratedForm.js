"use client";

import { useState } from "react";

export default function GeneratedForm({ formSchema }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  return (
    <form className="space-y-4 p-4">
      {formSchema.map((field, index) => (
        <div key={index} className="flex flex-col">
          <label className="font-semibold">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>

          {/* Поля для разных типов */}
          {field.type === "text" && (
            <input
              type="text"
              className="border p-2 rounded"
              required={field.required}
              onChange={(e) => handleChange(e, field.label)}
            />
          )}

          {field.type === "file_upload" && (
            <input
              type="file"
              className="border p-2 rounded"
              required={field.required}
              onChange={(e) => handleChange(e, field.label)}
            />
          )}

          {field.type === "date" && (
            <input
              type="date"
              className="border p-2 rounded"
              required={field.required}
              onChange={(e) => handleChange(e, field.label)}
            />
          )}
        </div>
      ))}
    
    </form>
  );
}
