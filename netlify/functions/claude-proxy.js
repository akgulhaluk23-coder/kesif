exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);

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

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data)
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
