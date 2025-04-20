"use client";

import { useState } from "react";

export default function EditableFormTable({ initialFields, setFields }) {
  const [localFields, setLocalFields] = useState(initialFields || []);

  function handleFieldChange(index, field, value) {
    const updatedFields = [...localFields];
    updatedFields[index][field] = value;
    setLocalFields(updatedFields);
    setFields(updatedFields); // синхронизируем наружу
  }

  function handleAddField() {
    const updatedFields = [
      ...localFields,
      { label: "", type: "text", required: false }
    ];
    setLocalFields(updatedFields);
    setFields(updatedFields);
  }

  function handleDeleteField(index) {
    const updatedFields = [...localFields];
    updatedFields.splice(index, 1);
    setLocalFields(updatedFields);
    setFields(updatedFields);
  }

  return (
    <div className="space-y-4">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Label</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Required</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {localFields.length > 0 ? (
            localFields.map((field, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => handleFieldChange(index, "label", e.target.value)}
                    className="w-full border p-1"
                  />
                </td>
                <td className="border p-2">
                  <select
                    value={field.type}
                    onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                    className="w-full border p-1"
                  >
                    <option value="text">Text</option>
                    <option value="date">Date</option>
                    <option value="file_upload">File Upload</option>
                    <option value="radio">Radio</option>
                    <option value="select">Select</option>
                  </select>
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => handleFieldChange(index, "required", e.target.checked)}
                  />
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDeleteField(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border p-2 text-center" colSpan={4}>Нет полей для отображения</td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        onClick={handleAddField}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Добавить поле
      </button>
    </div>
  );
}
