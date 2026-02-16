"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DealManagementActionsProps {
    dealId: number;
    initialHidden: boolean;
    initialLowest: boolean;
    initialAdminNote: string | null;
}

export default function DealManagementActions({
    dealId,
    initialHidden,
    initialLowest,
    initialAdminNote,
}: DealManagementActionsProps) {
    const router = useRouter();
    const [isHidden, setIsHidden] = useState(initialHidden);
    const [isLowest, setIsLowest] = useState(initialLowest);
    const [note, setNote] = useState(initialAdminNote || "");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function patchDeal(payload: Record<string, unknown>): Promise<boolean> {
        setIsSaving(true);
        setError(null);
        try {
            const response = await fetch(`/api/admin/deals/${dealId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = (await response.json()) as { ok?: boolean; error?: string };
            if (!response.ok || !data.ok) {
                throw new Error(data.error || "저장에 실패했습니다.");
            }

            router.refresh();
            return true;
        } catch (e) {
            setError(e instanceof Error ? e.message : "요청 처리 중 오류가 발생했습니다.");
            return false;
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", alignItems: "flex-end" }}>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button
                    type="button"
                    className="btn btn-outline"
                    style={{ height: "1.95rem", padding: "0 0.65rem", fontSize: "0.75rem" }}
                    onClick={() => {
                        const prev = isHidden;
                        const next = !isHidden;
                        setIsHidden(next);
                        void patchDeal({ isHidden: next }).then((ok) => {
                            if (!ok) setIsHidden(prev);
                        });
                    }}
                    disabled={isSaving}
                >
                    {isHidden ? "노출 전환" : "숨김 전환"}
                </button>
                <button
                    type="button"
                    className="btn btn-outline"
                    style={{ height: "1.95rem", padding: "0 0.65rem", fontSize: "0.75rem" }}
                    onClick={() => {
                        const prev = isLowest;
                        const next = !isLowest;
                        setIsLowest(next);
                        void patchDeal({ isLowest: next }).then((ok) => {
                            if (!ok) setIsLowest(prev);
                        });
                    }}
                    disabled={isSaving}
                >
                    {isLowest ? "허니픽 해제" : "허니픽 지정"}
                </button>
            </div>
            <div style={{ display: "flex", gap: "0.35rem", width: "100%", justifyContent: "flex-end" }}>
                <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="input"
                    placeholder="관리 메모"
                    style={{ maxWidth: "13rem", height: "1.95rem", fontSize: "0.75rem" }}
                    disabled={isSaving}
                />
                <button
                    type="button"
                    className="btn btn-primary"
                    style={{ height: "1.95rem", padding: "0 0.65rem", fontSize: "0.75rem" }}
                    onClick={() => {
                        void patchDeal({ adminNote: note });
                    }}
                    disabled={isSaving}
                >
                    {isSaving ? "저장 중" : "메모 저장"}
                </button>
            </div>
            {error && (
                <p style={{ fontSize: "0.75rem", color: "var(--color-rose-600)", textAlign: "right" }}>
                    {error}
                </p>
            )}
        </div>
    );
}
