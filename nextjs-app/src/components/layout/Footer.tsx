import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12">
            <div className="container mx-auto px-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-lg">🐝</span>
                    </div>
                    <span className="text-lg font-black tracking-tight text-white">
                        티꿀모아
                    </span>
                </div>
                <p className="text-sm mb-4">
                    전국 모든 핫딜을 한자리에 모았다. 티꿀모아
                    <br /> © 2026 TinyHoney Platform. All Rights Reserved.
                </p>
                <div className="flex justify-center gap-6 text-xs font-semibold uppercase tracking-widest">
                    <Link href="#" className="hover:text-yellow-400 transition-colors">
                        서비스 약관
                    </Link>
                    <Link href="#" className="hover:text-yellow-400 transition-colors">
                        개인정보 처리방침
                    </Link>
                    <Link href="#" className="hover:text-yellow-400 transition-colors">
                        광고 문의
                    </Link>
                </div>
            </div>
        </footer>
    );
}
