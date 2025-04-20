export async function POST(request) {
  try {
    const { fields } = await request.json();

    const allowedTypes = ["text", "date"]; // Только текстовые и дата-поля

    const payload = {
      title: "Форма анкеты",
      fields: fields
        .filter(field => allowedTypes.includes(field.type)) // оставляем только text и date
        .map(field => {
          const typeMapping = {
            text: "short_text",
            date: "date"
          };

          const mappedType = typeMapping[field.type] || "short_text";

          return {
            title: field.label,
            type: mappedType,
            validations: {
              required: field.required || false
            }
          };
        })
    };

    console.log("Payload для Typeform:", JSON.stringify(payload, null, 2));

    const response = await fetch("https://api.typeform.com/forms", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TYPEFORM_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Ошибка от Typeform:", text);
      throw new Error("Ошибка при создании формы в Typeform");
    }

    const result = await response.json();
    return new Response(
      JSON.stringify(result),
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка в create-typeform route:", error.message || error);
    return new Response(
      JSON.stringify({ status: "error", message: error.message || "Ошибка создания формы." }),
      { status: 500 }
    );
  }
}
