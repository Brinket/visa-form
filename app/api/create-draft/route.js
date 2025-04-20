export const maxDuration = 50; // This function can run for a maximum of 50 seconds
export async function POST(request) {
    try {
      const { url } = await request.json();
  
      if (!url) {
        return new Response(
          JSON.stringify({ status: "error", message: "Не указана ссылка на файл." }),
          { status: 400 }
        );
      }
  
      // ✨ Делаем запрос к Make Webhook
      const makeResponse = await fetch("https://ivans2250.app.n8n.cloud/webhook/84146bf8-56b8-4cc2-8a8e-ebd5c5114d7e", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });
  
      if (!makeResponse.ok) {
        throw new Error("Ошибка при обращении к Make Webhook");
      }
  
      const makeResult = await makeResponse.json();
      console.log("Ответ от Make:", makeResult);
  
      // ✨ Приводим ответ к нужному виду
      let fields = [];
  
      if (Array.isArray(makeResult)) {
        fields = makeResult[0]?.fields || [];
      } else if (makeResult.fields) {
        fields = makeResult.fields;
      } else {
        console.error("Неожиданный формат данных из Make:", makeResult);
        return new Response(
          JSON.stringify({ status: "error", message: "Неожиданный формат данных от Make." }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
  
      // ✨ Возвращаем чистый объект с полями
      console.log("Отправляем назад на фронт:", JSON.stringify({ fields }, null, 2));
      return new Response(
        JSON.stringify({ fields }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Ошибка в create-draft route:", error);
  
      return new Response(
        JSON.stringify({ status: "error", message: "Ошибка сервера или Make Webhook недоступен." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }
  