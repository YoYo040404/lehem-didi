import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "אופה מחמצת",
  description: "עוזר אפייה אישי בעברית לחישוב כמויות, זמנים ולוח עבודה ללחם מחמצת.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <body className="min-h-full bg-[radial-gradient(circle_at_top,#fff7ed,transparent_35%),linear-gradient(180deg,#fffdf8_0%,#f8fafc_100%)] text-slate-950">
        {children}
      </body>
    </html>
  );
}
