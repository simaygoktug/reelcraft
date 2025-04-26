/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/generate/route.ts


import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // env’den otomatik okunuyor
});

// Bu fonksiyon artık Whisper çağrısı yapmıyor,
// sadece dosya adını prompt’a ekliyor.
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Dosya adından uzantıyı atıp sadece başlığı alıyoruz
    const title = file.name.replace(/\.[^/.]+$/, "");

    // 1) Caption isteği
    const captionRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Write me an engaging social media caption for a short video titled "${title}".`,
        },
      ],
    });

    // 2) Hashtag isteği
    const hashtagsRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Give me 5 trending hashtags for a short video titled "${title}".`,
        },
      ],
    });

    // 3) TS null hata çıkmasın diye optional chaining + nullish coalescing
    const caption =
      captionRes.choices?.[0]?.message?.content?.trim() ?? "";
    const hashtags =
      hashtagsRes.choices?.[0]?.message?.content?.trim() ?? "";

    return NextResponse.json({ caption, hashtags });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
