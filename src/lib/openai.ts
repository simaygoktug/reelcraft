// lib/openai.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,    // .env.local’dan gelecek
  dangerouslyAllowBrowser: true,
});

export async function generateCaption(): Promise<string> {
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "Give me an engaging caption for a short video about AI.",
      },
    ],
  });

  // choices[0], message ve content’in varlığını kontrol et
  const content = res.choices?.[0]?.message?.content;
  return content?.trim() ?? "";  // null veya undefined ise boş string döner
}

export async function generateHashtags(): Promise<string> {
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "Give me 5 trending hashtags for a short video about AI.",
      },
    ],
  });

  const content = res.choices?.[0]?.message?.content;
  return content?.trim() ?? "";
}
