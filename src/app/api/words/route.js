import { NextResponse } from "next/server";
import {
  findWords,
  MIN_SUPPORTED_LENGTH,
  MAX_SUPPORTED_LENGTH,
} from "@/lib/wordFinder";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const letters = searchParams.get("letters") || "";
  const min = Number(searchParams.get("min")) || MIN_SUPPORTED_LENGTH;
  const max = Number(searchParams.get("max")) || MAX_SUPPORTED_LENGTH;

  const cleanLetters = letters.replace(/[^a-zA-Z]/g, "");
  if (!cleanLetters) {
    return NextResponse.json(
      { error: "Provide at least one letter, e.g. ?letters=trapes" },
      { status: 400 }
    );
  }

  const result = findWords(cleanLetters, min, max);
  return NextResponse.json(result);
}
