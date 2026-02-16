import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
    title: "티꿀모아 TinyHoney - 실시간 핫딜 모음",
    description: "전국 모든 핫딜을 한자리에. 뽐뿌, 루리웹, 퀘이사존, 클리앙 등 7개 커뮤니티 실시간 크롤링",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
