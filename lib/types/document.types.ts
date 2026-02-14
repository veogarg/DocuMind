export interface UserDocument {
    id: string;
    user_id: string;
    file_name: string;
    file_path: string;
    created_at: string;
}

export interface DocumentChunk {
    id?: string;
    user_id: string;
    file_name: string;
    content: string;
    embedding: number[];
    created_at?: string;
}

export interface FileUploadParams {
    file: File;
    userId: string;
}

export interface FileProcessParams {
    filePath: string;
    fileName: string;
    userId: string;
}
