import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
                                <span className="text-2xl">🐝</span>
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900">
                                티꿀모아
                                <span className="text-yellow-500 text-sm ml-1 italic font-medium">
                                    TinyHoney
                                </span>
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/"
                                className="text-sm font-semibold hover:text-yellow-500 transition-colors"
                            >
                                실시간 핫딜
                            </Link>
                            <Link
                                href="/events"
                                className="text-sm font-semibold hover:text-yellow-500 transition-colors"
                            >
                                진행 중 이벤트
                            </Link>
                            <Link
                                href="/community"
                                className="text-sm font-semibold hover:text-yellow-500 transition-colors"
                            >
                                커뮤니티
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                        <Link
                            href="/auth/login"
                            className="text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors"
                        >
                            로그인
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-sm font-bold rounded-full transition-all shadow-sm hover:shadow-md active:scale-95"
                        >
                            시작하기
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
