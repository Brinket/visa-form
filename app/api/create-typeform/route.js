// app/api/create-typeform/route.js

export async function POST(request) {
  try {
    const { fields } = await request.json(); // Получаем поля из тела запроса

    if (!fields || !Array.isArray(fields)) {
      return new Response(
        JSON.stringify({ status: "error", message: "Некорректные поля для создания формы." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Фильтруем допустимые типы полей
    const allowedTypes = ["short_text", "date"];
    const filteredFields = fields.filter(field => allowedTypes.includes(field.type));

    // Формируем правильный payload
    const payload = {
      title: "Форма анкеты", // Название формы
      fields: filteredFields.map(field => ({
        title: field.label,
        type: field.type === "short_text" ? "short_text" : "date",
        validations: { required: field.required || false }
      }))
    };

    console.log("Отправляем payload в Typeform:", JSON.stringify(payload, null, 2));

    // Запрос в Typeform API
    const typeformResponse = await fetch("https://api.typeform.com/forms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TYPEFORM_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const typeformResult = await typeformResponse.json();

    if (!typeformResponse.ok) {
      console.error("Ошибка от Typeform:", typeformResult);
      throw new Error("Ошибка при создании формы в Typeform");
    }

    // Успех
    return new Response(
      JSON.stringify(typeformResult),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Ошибка в create-typeform route:", error.message || error);

    return new Response(
      JSON.stringify({ status: "error", message: "Ошибка при создании формы в Typeform" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
