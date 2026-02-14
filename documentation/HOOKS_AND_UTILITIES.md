# DocuMind - Extracted Hooks & Utilities Reference

## 🎣 Custom Hooks

### 1. **useAuth** (`hooks/useAuth.ts`)

**Purpose**: Centralized authentication state and operations

**API:**
```typescript
const {
  user,           // Current user or null
  loading,        // Loading state
  signIn,         // (email, password) => Promise<void>
  signUp,         // (email, password) => Promise<void>
  signOut,        // () => Promise<void>
  isAuthenticated // boolean
} = useAuth();
```

**Usage:**
```typescript
// In AuthPage
const { user, loading, signIn, signUp } = useAuth();

// Sign in
await signIn(email, password);

// Sign up
await signUp(email, password);
```

**Replaces:**
- Duplicate auth logic in `AuthPage`
- Manual Supabase client creation
- Scattered auth state management

---

### 2. **useUser** (`hooks/useUser.ts`)

**Purpose**: Fetch current user without auth operations

**API:**
```typescript
const {
  user,    // Current user or null
  loading, // Loading state
  reload   // () => Promise<void>
} = useUser();
```

**Usage:**
```typescript
// In AppLayout
const { user, loading } = useUser();

if (!user) {
  router.push("/auth");
}
```

**Replaces:**
- Manual `supabase.auth.getUser()` calls
- Duplicate user fetching logic

---

### 3. **useChatSessions** (`hooks/useChatSessions.ts`)

**Purpose**: Manage chat sessions state and operations

**API:**
```typescript
const {
  sessions,          // ChatSession[]
  loading,           // boolean
  error,             // Error | null
  reload,            // () => Promise<void>
  createSession,     // (userId, title?) => Promise<ChatSession>
  updateSessionTitle // (sessionId, title) => Promise<void>
} = useChatSessions(userId);
```

**Usage:**
```typescript
// In AppLayout
const { sessions } = useChatSessions(user?.id);

// Create new session
const newSession = await createSession(user.id, "My Chat");

// Update title
await updateSessionTitle(sessionId, "Updated Title");
```

**Replaces:**
- Manual session fetching in `AppLayout`
- Duplicate session creation logic
- Manual state management

---

### 4. **useChatMessages** (`hooks/useChatMessages.ts`)

**Purpose**: Manage messages with optimistic updates

**API:**
```typescript
const {
  messages,             // ChatMessage[]
  loading,              // boolean
  error,                // Error | null
  reload,               // () => Promise<void>
  addMessage,           // (role, content) => Promise<void>
  addOptimisticMessage, // (role, content) => void
  setMessages           // React.Dispatch<SetStateAction<ChatMessage[]>>
} = useChatMessages(sessionId);
```

**Usage:**
```typescript
// In ChatPage
const { messages, addMessage } = useChatMessages(sessionId);

// Add message with optimistic update
await addMessage("user", "Hello!");

// Add optimistic message (no await)
addOptimisticMessage("ai", "Thinking...");
```

**Replaces:**
- Manual message fetching in `ChatPage`
- Complex optimistic update logic
- Manual message state management

---

### 5. **useDocuments** (`hooks/useDocuments.ts`)

**Purpose**: Manage user documents listing

**API:**
```typescript
const {
  documents, // UserDocument[]
  loading,   // boolean
  error,     // Error | null
  reload     // () => Promise<void>
} = useDocuments(userId);
```

**Usage:**
```typescript
// In AppLayout
const { documents } = useDocuments(user?.id);

// Reload after upload
await reload();
```

**Replaces:**
- Manual document fetching in `AppLayout`
- Duplicate document state management

---

### 6. **useFileUpload** (`hooks/useFileUpload.ts`)

**Purpose**: Orchestrate file upload flow with status tracking

**API:**
```typescript
const {
  status: {
    uploading,   // boolean
    processing,  // boolean
    message,     // string | null
    error        // Error | null
  },
  uploadFile,    // (file, userId) => Promise<{fileName, filePath}>
  reset,         // () => void
  isUploading    // boolean
} = useFileUpload();
```

**Usage:**
```typescript
// In ChatPage
const { status, uploadFile, isUploading } = useFileUpload();

// Upload file
const result = await uploadFile(file, user.id);
console.log(result.fileName, result.filePath);

// Show status
if (status.message) {
  console.log(status.message); // "Uploading file.pdf..."
}
```

**Replaces:**
- Complex upload logic in `ChatPage`
- Manual status tracking
- Scattered upload state

---

### 7. **useAutoScroll** (`hooks/useAutoScroll.ts`)

**Purpose**: Reusable auto-scroll behavior

**API:**
```typescript
const ref = useAutoScroll<HTMLDivElement>([dependencies]);
```

**Usage:**
```typescript
// In MessageList
const bottomRef = useAutoScroll<HTMLDivElement>([messages]);

return (
  <div>
    {messages.map(...)}
    <div ref={bottomRef} />
  </div>
);
```

**Replaces:**
- Manual `useRef` + `useEffect` for scrolling
- Duplicate scroll logic

---

## 🛠️ Utility Functions

### 1. **chunkText** (`lib/utils/chunk.ts`)

**Purpose**: Split text into chunks for embedding

**API:**
```typescript
function chunkText(text: string, size?: number): string[]
```

**Usage:**
```typescript
const chunks = chunkText(documentText, 800);
// Returns: ["chunk1...", "chunk2...", ...]
```

**Improvements:**
- Uses config constant for default size
- Added JSDoc documentation
- Better error handling

---

### 2. **File Utilities** (`lib/utils/file.ts`)

**Purpose**: File handling operations

**API:**
```typescript
// Sanitize filename
function sanitizeFilename(filename: string): string

// Generate unique file path
function generateFilePath(userId: string, filename: string): string

// Validate file type
function validateFileType(file: File, allowedTypes: string[]): boolean

// Validate file size
function validateFileSize(file: File, maxSizeInMB: number): boolean
```

**Usage:**
```typescript
const safeName = sanitizeFilename("my file!.pdf");
// Returns: "my_file_.pdf"

const path = generateFilePath(userId, "resume.pdf");
// Returns: "user123/1234567890_resume.pdf"

const isValid = validateFileType(file, ["application/pdf"]);
// Returns: true/false

const isSizeOk = validateFileSize(file, 10);
// Returns: true if file <= 10MB
```

---

### 3. **cn** (`lib/utils/cn.ts`)

**Purpose**: Merge Tailwind classes

**API:**
```typescript
function cn(...inputs: ClassValue[]): string
```

**Usage:**
```typescript
const className = cn(
  "base-class",
  condition && "conditional-class",
  { "object-class": true }
);
```

**Note**: Re-exported from `lib/utils.ts` for backward compatibility

---

## 🔧 Service Classes

### 1. **AuthService** (`lib/services/auth.service.ts`)

**Purpose**: Authentication operations

**API:**
```typescript
class AuthService {
  async getCurrentUser(): Promise<User | null>
  async signIn(email: string, password: string)
  async signUp(email: string, password: string)
  async signOut()
  async checkSession(): Promise<boolean>
}

// Singleton instance
export const authService: AuthService
```

**Usage:**
```typescript
const user = await authService.getCurrentUser();
await authService.signIn(email, password);
await authService.signOut();
```

---

### 2. **ChatService** (`lib/services/chat.service.ts`)

**Purpose**: Chat operations

**API:**
```typescript
class ChatService {
  async getChatSessions(userId?: string): Promise<ChatSession[]>
  async getChatSession(sessionId: string): Promise<ChatSession | null>
  async createChatSession(userId: string, title?: string): Promise<ChatSession>
  async updateChatTitle(sessionId: string, title: string): Promise<void>
  async getMessages(sessionId: string): Promise<ChatMessage[]>
  async saveMessage(message: ChatMessageInput): Promise<ChatMessage>
  async getLatestChatSession(userId: string): Promise<ChatSession | null>
}

export const chatService: ChatService
```

**Usage:**
```typescript
const sessions = await chatService.getChatSessions(userId);
const newSession = await chatService.createChatSession(userId);
const messages = await chatService.getMessages(sessionId);
await chatService.saveMessage({ session_id, role, content });
```

---

### 3. **DocumentService** (`lib/services/document.service.ts`)

**Purpose**: Document management

**API:**
```typescript
class DocumentService {
  async getDocuments(userId: string): Promise<UserDocument[]>
  async uploadFile(file: File, userId: string): Promise<string>
  async saveDocumentRecord(userId: string, fileName: string, filePath: string): Promise<UserDocument>
  async downloadFile(filePath: string): Promise<Blob>
}

export const documentService: DocumentService
```

**Usage:**
```typescript
const docs = await documentService.getDocuments(userId);
const filePath = await documentService.uploadFile(file, userId);
const doc = await documentService.saveDocumentRecord(userId, fileName, filePath);
```

---

### 4. **AIService** (`lib/services/ai.service.ts`)

**Purpose**: AI API operations

**API:**
```typescript
class AIService {
  async generateResponse(config: AIServiceConfig): Promise<string>
  async processDocument(filePath: string, fileName: string, userId: string): Promise<void>
}

export const aiService: AIService
```

**Usage:**
```typescript
const reply = await aiService.generateResponse({
  messages: [...],
  userId: "user123"
});

await aiService.processDocument(filePath, fileName, userId);
```

---

## 🤖 AI Modules

### 1. **Gemini Client** (`lib/ai/gemini.client.ts`)

**Purpose**: Initialize Gemini AI client

**API:**
```typescript
export const genAI: GoogleGenerativeAI
```

**Usage:**
```typescript
import { genAI } from "@/lib/ai/gemini.client";

const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
```

---

### 2. **Embeddings** (`lib/ai/embeddings.ts`)

**Purpose**: Generate embeddings

**API:**
```typescript
async function generateEmbedding(content: string): Promise<number[]>
async function generateEmbeddings(chunks: string[]): Promise<number[][]>
```

**Usage:**
```typescript
const embedding = await generateEmbedding("Hello world");
// Returns: [0.123, 0.456, ...]

const embeddings = await generateEmbeddings(["chunk1", "chunk2"]);
// Returns: [[0.123, ...], [0.456, ...]]
```

---

### 3. **RAG** (`lib/ai/rag.ts`)

**Purpose**: Retrieval-Augmented Generation

**API:**
```typescript
async function retrieveRelevantChunks(
  query: string,
  userId: string,
  matchCount?: number
): Promise<RAGContext[]>

async function generateRAGResponse(
  messages: Array<{ role: string; content: string }>,
  context: string
): Promise<string>
```

**Usage:**
```typescript
// Retrieve relevant chunks
const chunks = await retrieveRelevantChunks("What are my skills?", userId);

// Generate response with context
const reply = await generateRAGResponse(messages, context);
```

---

## 📝 Type Definitions

### 1. **User Types** (`lib/types/user.types.ts`)

```typescript
export type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string | null;
  created_at?: string;
}
```

---

### 2. **Chat Types** (`lib/types/chat.types.ts`)

```typescript
export interface ChatSession {
  id: string;
  title: string | null;
  created_at: string;
  user_id: string;
}

export interface ChatMessage {
  id?: string;
  session_id: string;
  role: "user" | "ai";
  content: string;
  created_at?: string;
}

export interface ChatMessageInput {
  session_id: string;
  role: "user" | "ai";
  content: string;
}
```

---

### 3. **Document Types** (`lib/types/document.types.ts`)

```typescript
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
```

---

## ⚙️ Configuration

### **App Config** (`lib/constants/config.ts`)

```typescript
export const APP_CONFIG = {
  CHUNK_SIZE: 800,
  MAX_MATCH_COUNT: 5,
  DEFAULT_CHAT_TITLE: "New Chat",
  GEMINI_EMBEDDING_MODEL: "gemini-embedding-001",
  GEMINI_CHAT_MODEL: "gemini-flash-latest",
} as const;

export const STORAGE_BUCKETS = {
  USER_FILES: "user-files",
} as const;

export const DATABASE_TABLES = {
  CHAT_SESSIONS: "chat_sessions",
  MESSAGES: "messages",
  USER_DOCUMENTS: "user_documents",
  DOCUMENT_CHUNKS: "document_chunks",
} as const;
```

**Usage:**
```typescript
import { APP_CONFIG, DATABASE_TABLES } from "@/lib/constants/config";

const chunks = chunkText(text, APP_CONFIG.CHUNK_SIZE);
await supabase.from(DATABASE_TABLES.MESSAGES).select("*");
```

---

## 📊 Usage Statistics

### Hooks Usage:
- **useAuth**: 2 components (AuthPage, AppLayout)
- **useUser**: 3 components (Home, AppLayout, ChatPage)
- **useChatSessions**: 1 component (AppLayout)
- **useChatMessages**: 1 component (ChatPage)
- **useDocuments**: 1 component (AppLayout)
- **useFileUpload**: 1 component (ChatPage)
- **useAutoScroll**: 1 component (MessageList)

### Services Usage:
- **authService**: Used by useAuth hook
- **chatService**: Used by useChatSessions, useChatMessages, Home
- **documentService**: Used by useDocuments, useFileUpload
- **aiService**: Used by ChatPage, API routes

### Utilities Usage:
- **chunkText**: API routes
- **file utilities**: DocumentService
- **cn**: All UI components

---

## 🎯 Migration Guide

### Before (Old Pattern):
```typescript
// Duplicate Supabase client creation
const supabase = createClient();
const { data } = await supabase.auth.getUser();

// Manual state management
const [sessions, setSessions] = useState([]);
const { data: chats } = await supabase
  .from("chat_sessions")
  .select("*");
setSessions(chats || []);
```

### After (New Pattern):
```typescript
// Use hooks
const { user } = useUser();
const { sessions } = useChatSessions(user?.id);
```

---

## ✅ Benefits Summary

### Code Reusability:
- **7 custom hooks** replace hundreds of lines of duplicate code
- **4 service classes** centralize all data operations
- **Multiple utilities** for common operations

### Type Safety:
- **3 type definition files** ensure compile-time safety
- **Proper interfaces** for all data structures
- **Better IDE autocomplete**

### Maintainability:
- **Single source of truth** for each operation
- **Easy to update** - change once, applies everywhere
- **Clear separation of concerns**

### Developer Experience:
- **Intuitive API** - hooks and services are self-documenting
- **Consistent patterns** across the codebase
- **Easy to test** - isolated, pure functions

---

**All hooks and utilities are production-ready and fully tested! 🎉**
