exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { kesif, not, mod } = JSON.parse(event.body);

    const sistem = "Sen SPK lisanslı gayrimenkul değerleme uzmanısın. Türk mahkemelerine sunulmak üzere profesyonel bilirkişi raporu taslağı hazırlıyorsun. Raporu Türkçe, resmi ve hukuki dilde yaz.";

    const mesaj = `Keşif Bilgileri:
- Mahkeme: ${kesif.mahkeme}
- Tarih: ${kesif.tarih}
- Saat: ${kesif.saat}
- Dosya No: ${kesif.dosya_no || "Belirtilmemiş"}
- Evrak Sayısı: ${kesif.evrakSayisi || 0} adet${mod === "ilave" && not ? "\n\nİlave Bilgiler:\n" + not : ""}

Aşağıdaki bölümleri içeren bilirkişi raporu taslağı yaz:
1. GÖREV VE KAPSAM
2. İNCELEME KONUSU TAŞINMAZ BİLGİLERİ
3. TAŞINMAZIN MEVCUT DURUMU
4. PİYASA ANALİZİ VE DEĞERLEME YÖNTEMİ
5. DEĞER TESPİTİ VE SONUÇ
6. BİLİRKİŞİ KANAAT VE SONUCU`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        system: sistem,
        messages: [{ role: "user", content: mesaj }]
      })
    });

    const data = await response.json();
    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data)
    };
  } catch(e) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: e.message })
    };
  }
};
