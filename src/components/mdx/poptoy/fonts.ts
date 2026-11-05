import { Geist_Mono, Hanken_Grotesk } from "next/font/google";

// The figures carry their own faces, as in the review app: a quiet grotesque for
// text and a mono for every technical name.
export const poptoySans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-poptoy-sans",
  display: "swap",
});

export const poptoyMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-poptoy-mono",
  display: "swap",
});
