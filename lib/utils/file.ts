/**
 * Sanitizes a filename by replacing unsafe characters
 * @param filename - The original filename
 * @returns Sanitized filename safe for storage
 */
export function sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9.-]/g, "_");
}

/**
 * Generates a unique file path for storage
 * @param userId - The user's ID
 * @param filename - The original filename
 * @returns Unique file path
 */
export function generateFilePath(userId: string, filename: string): string {
    const safeName = sanitizeFilename(filename);
    return `${userId}/${Date.now()}_${safeName}`;
}

/**
 * Validates file type
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns true if file type is allowed
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
}

/**
 * Validates file size
 * @param file - The file to validate
 * @param maxSizeInMB - Maximum file size in megabytes
 * @returns true if file size is within limit
 */
export function validateFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
}
