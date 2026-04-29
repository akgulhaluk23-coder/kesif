exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    console.log("İstek alındı, model:", body.model);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "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",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("Anthropic yanıtı status:", response.status);
    if (!response.ok) {
      console.log("Anthropic hata detayı:", JSON.stringify(data));
    }

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data)
    };
  } catch(e) {
    console.log("Genel hata:", e.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
