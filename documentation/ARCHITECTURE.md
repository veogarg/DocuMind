# DocuMind - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  Pages (app/)                                                    │
│  ├── page.tsx (Home - Router)                                   │
│  ├── auth/page.tsx (Authentication)                             │
│  └── (app)/                                                      │
│      ├── layout.tsx (App Shell)                                 │
│      └── chat/[id]/page.tsx (Chat Interface)                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓ uses
┌─────────────────────────────────────────────────────────────────┐
│                        COMPONENT LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  UI Components (components/)                                     │
│  ├── chat/                                                       │
│  │   ├── ChatMessage.tsx                                        │
│  │   ├── MessageList.tsx                                        │
│  │   └── ChatInput.tsx                                          │
│  ├── layout/                                                     │
│  │   ├── Sidebar.tsx                                            │
│  │   ├── Header.tsx                                             │
│  │   ├── DocumentList.tsx                                       │
│  │   └── ChatSessionList.tsx                                    │
│  ├── auth/                                                       │
│  │   └── AuthForm.tsx                                           │
│  └── ui/ (shadcn components)                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓ uses
┌─────────────────────────────────────────────────────────────────┐
│                          HOOKS LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Custom Hooks (hooks/)                                           │
│  ├── useAuth.ts           → Authentication state                │
│  ├── useUser.ts           → User data fetching                  │
│  ├── useChatSessions.ts   → Chat sessions management            │
│  ├── useChatMessages.ts   → Messages with optimistic updates    │
│  ├── useDocuments.ts      → Documents listing                   │
│  ├── useFileUpload.ts     → File upload orchestration           │
│  └── useAutoScroll.ts     → Auto-scroll behavior                │
└─────────────────────────────────────────────────────────────────┘
                              ↓ uses
┌─────────────────────────────────────────────────────────────────┐
│                        SERVICE LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Business Logic (lib/services/)                                  │
│  ├── auth.service.ts      → Authentication operations           │
│  ├── chat.service.ts      → Chat CRUD operations                │
│  ├── document.service.ts  → Document management                 │
│  └── ai.service.ts        → AI API calls                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓ uses
┌─────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  ├── Supabase Client (lib/supabase/)                            │
│  │   └── client.ts                                              │
│  └── AI Modules (lib/ai/)                                       │
│      ├── gemini.client.ts  → Gemini initialization              │
│      ├── embeddings.ts     → Embedding generation               │
│      └── rag.ts            → RAG logic                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓ uses
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│  ├── Supabase (Database + Storage + Auth)                       │
│  └── Google Gemini AI (Embeddings + Chat)                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### 1. Authentication Flow
```
User Input (AuthForm)
    ↓
useAuth Hook
    ↓
AuthService
    ↓
Supabase Auth
    ↓
User Session Created
```

### 2. Chat Message Flow
```
User Types Message (ChatInput)
    ↓
ChatPage.handleSendMessage()
    ↓
useChatMessages.addMessage()
    ↓
ChatService.saveMessage()
    ↓
Supabase Database
    ↓
AIService.generateResponse()
    ↓
API Route (/api/chat)
    ↓
RAG Module (retrieveRelevantChunks + generateRAGResponse)
    ↓
Gemini AI
    ↓
Response Saved to Database
    ↓
UI Updated (MessageList)
```

### 3. File Upload Flow
```
User Selects File (ChatInput)
    ↓
ChatPage.handleFileUpload()
    ↓
useFileUpload.uploadFile()
    ↓
DocumentService.uploadFile()
    ↓
Supabase Storage
    ↓
DocumentService.saveDocumentRecord()
    ↓
Supabase Database
    ↓
AIService.processDocument()
    ↓
API Route (/api/process-file)
    ↓
PDF Parsing + Text Chunking
    ↓
Embedding Generation
    ↓
Store in Vector Database
    ↓
Success Message in Chat
```

---

## 🔄 State Management

### Client-Side State (React Hooks)
```
useAuth
├── user: User | null
├── loading: boolean
├── signIn()
├── signUp()
└── signOut()

useUser
├── user: User | null
├── loading: boolean
└── reload()

useChatSessions
├── sessions: ChatSession[]
├── loading: boolean
├── error: Error | null
├── reload()
├── createSession()
└── updateSessionTitle()

useChatMessages
├── messages: ChatMessage[]
├── loading: boolean
├── error: Error | null
├── reload()
├── addMessage()
├── addOptimisticMessage()
└── setMessages()

useDocuments
├── documents: UserDocument[]
├── loading: boolean
├── error: Error | null
└── reload()

useFileUpload
├── status: UploadStatus
├── uploadFile()
├── reset()
└── isUploading: boolean
```

### Server-Side State (Supabase)
```
Database Tables:
├── chat_sessions
│   ├── id
│   ├── user_id
│   ├── title
│   └── created_at
├── messages
│   ├── id
│   ├── session_id
│   ├── role
│   ├── content
│   └── created_at
├── user_documents
│   ├── id
│   ├── user_id
│   ├── file_name
│   ├── file_path
│   └── created_at
└── document_chunks
    ├── id
    ├── user_id
    ├── file_name
    ├── content
    ├── embedding (vector)
    └── created_at

Storage Buckets:
└── user-files/
    └── {user_id}/{timestamp}_{filename}
```

---

## 🎯 Component Hierarchy

```
RootLayout (app/layout.tsx)
└── Page Router
    ├── Home (app/page.tsx)
    │   └── Redirects to /auth or /chat
    │
    ├── AuthPage (app/auth/page.tsx)
    │   └── AuthForm
    │       ├── Email Input
    │       ├── Password Input
    │       ├── Sign In Button
    │       └── Sign Up Button
    │
    └── AppLayout (app/(app)/layout.tsx)
        ├── Sidebar
        │   ├── Logo Link
        │   ├── New Chat Button
        │   ├── DocumentList
        │   │   └── Document Items
        │   └── ChatSessionList
        │       └── Session Links
        │
        └── Main Area
            ├── Header
            │   ├── User Email
            │   └── Logout Button
            │
            └── ChatPage (app/(app)/chat/[id]/page.tsx)
                ├── MessageList
                │   └── ChatMessage (multiple)
                │       ├── Role Label
                │       └── Message Content
                │
                └── ChatInput
                    ├── File Upload Button
                    ├── Message Input
                    └── Send Button
```

---

## 🔐 Security Architecture

### Authentication
```
Client → Supabase Auth → JWT Token → Stored in Cookie
```

### Authorization
```
Row Level Security (RLS) in Supabase:
├── Users can only see their own chat sessions
├── Users can only see their own messages
├── Users can only see their own documents
└── Users can only access their own files
```

### API Security
```
API Routes:
├── Validate user authentication
├── Validate input parameters
├── Use service role key for admin operations
└── Return proper error codes
```

---

## 🚀 Performance Optimizations

### 1. Code Splitting
- Dynamic imports for services
- Route-based code splitting (Next.js)

### 2. Optimistic Updates
- Messages appear instantly
- Background sync with database

### 3. Lazy Loading
- Components loaded on demand
- Services imported when needed

### 4. Memoization Ready
- Pure components
- Stable function references
- Proper dependency arrays

### 5. Database Optimization
- Indexed queries
- Vector search for embeddings
- Efficient pagination

---

## 📦 Module Dependencies

```
Pages
  ↓ depends on
Hooks
  ↓ depends on
Services
  ↓ depends on
Data Access (Supabase/AI)
  ↓ depends on
External APIs
```

**Key Principle**: Dependencies flow downward only (no circular dependencies)

---

## 🧪 Testing Strategy

### Unit Tests
```
Services (lib/services/)
├── auth.service.test.ts
├── chat.service.test.ts
├── document.service.test.ts
└── ai.service.test.ts

Utilities (lib/utils/)
├── chunk.test.ts
├── file.test.ts
└── cn.test.ts

AI Modules (lib/ai/)
├── embeddings.test.ts
└── rag.test.ts
```

### Integration Tests
```
Hooks (hooks/)
├── useAuth.test.ts
├── useChatMessages.test.ts
└── useFileUpload.test.ts
```

### E2E Tests
```
User Flows
├── Authentication flow
├── Create chat session
├── Send message
└── Upload document
```

---

## 🔧 Configuration Management

### Environment Variables
```
.env
├── NEXT_PUBLIC_SUPABASE_URL
├── NEXT_PUBLIC_SUPABASE_ANON_KEY
├── SUPABASE_SERVICE_ROLE_KEY
└── GEMINI_API_KEY
```

### Application Config
```typescript
lib/constants/config.ts
├── APP_CONFIG
│   ├── CHUNK_SIZE
│   ├── MAX_MATCH_COUNT
│   ├── DEFAULT_CHAT_TITLE
│   ├── GEMINI_EMBEDDING_MODEL
│   └── GEMINI_CHAT_MODEL
├── STORAGE_BUCKETS
│   └── USER_FILES
└── DATABASE_TABLES
    ├── CHAT_SESSIONS
    ├── MESSAGES
    ├── USER_DOCUMENTS
    └── DOCUMENT_CHUNKS
```

---

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless API routes
- Session stored in database
- No server-side state

### Database Scaling
- Indexed queries
- Efficient vector search
- Connection pooling (Supabase)

### Caching Strategy
- Client-side caching (React Query ready)
- CDN for static assets
- Edge caching (Vercel)

### Future Enhancements
1. Add Redis for caching
2. Implement WebSocket for real-time updates
3. Add queue for background jobs
4. Implement rate limiting
5. Add monitoring and logging

---

## 🎨 Design Patterns Summary

1. **Singleton**: Services
2. **Repository**: Data access layer
3. **Custom Hook**: State management
4. **Composition**: Component structure
5. **Dependency Injection**: Props-based
6. **Factory**: Service creation
7. **Observer**: React state updates
8. **Strategy**: Different AI models

---

## 📚 Documentation Structure

```
/docs (future)
├── architecture.md (this file)
├── api-reference.md
├── component-library.md
├── hooks-reference.md
├── services-reference.md
├── deployment.md
└── contributing.md
```

---

**Architecture designed for:**
- ✅ Maintainability
- ✅ Scalability
- ✅ Testability
- ✅ Performance
- ✅ Security
- ✅ Developer Experience
