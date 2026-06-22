import React from "react";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import FeaturedMenu from "@/components/home/FeaturedMenu";
import Reviews from "@/components/home/ReviewsPreview";
import AboutSnippet from "@/components/home/AboutSnippet";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cafe Crown — Premium Vegetarian Cafe in Lucknow | 4.8★",
  description:
    "Visit Cafe Crown at Bharwara Crossing, Lucknow. Premium vegetarian food, cold coffees, burgers, maggi & more at budget-friendly prices. Open 11AM–10PM.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturedMenu />
      <AboutSnippet />
      <Reviews />
    </>
  );
}
