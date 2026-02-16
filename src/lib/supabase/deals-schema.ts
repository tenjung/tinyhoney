export function isDealsSchemaOutdated(message?: string | null) {
    if (!message) return false;
    return (
        message.includes("column deals.is_hidden does not exist") ||
        message.includes("column deals.admin_note does not exist") ||
        message.includes("column deals.moderated_at does not exist")
    );
}
