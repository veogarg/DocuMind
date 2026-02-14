# DocuMind - Quick Reference Guide

## 📁 File Structure at a Glance

```
DocuMind/
├── documentation/
│   ├── ARCHITECTURE.md           ← System architecture
│   ├── HOOKS_AND_UTILITIES.md    ← Hooks & utilities reference
│   ├── QUICK_REFERENCE.md        ← Quick reference
│
├── app/                         ← Next.js pages
│   ├── page.tsx                 ← Home (router)
│   ├── auth/page.tsx            ← Authentication
│   ├── (app)/
│   │   ├── layout.tsx           ← App shell
│   │   └── chat/[id]/page.tsx   ← Chat interface
│   └── api/
│       ├── chat/route.ts        ← AI chat endpoint
│       └── process-file/route.ts ← File processing
│
├── components/                  ← React components
│   ├── chat/                    ← Chat UI components
│   ├── layout/                  ← Layout components
│   ├── auth/                    ← Auth components
│   └── ui/                      ← Base UI (shadcn)
│
├── hooks/                       ← Custom React hooks
│   ├── useAuth.ts              ← Authentication
│   ├── useUser.ts              ← User data
│   ├── useChatSessions.ts      ← Chat sessions
│   ├── useChatMessages.ts      ← Messages
│   ├── useDocuments.ts         ← Documents
│   ├── useFileUpload.ts        ← File uploads
│   └── useAutoScroll.ts        ← Auto-scroll
│
└── lib/                        ← Core libraries
    ├── services/               ← Business logic
    │   ├── auth.service.ts
    │   ├── chat.service.ts
    │   ├── document.service.ts
    │   └── ai.service.ts
    │
    ├── ai/                     ← AI modules
    │   ├── gemini.client.ts
    │   ├── embeddings.ts
    │   └── rag.ts
    │
    ├── types/                  ← TypeScript types
    │   ├── user.types.ts
    │   ├── chat.types.ts
    │   └── document.types.ts
    │
    ├── utils/                  ← Utilities
    │   ├── chunk.ts
    │   ├── file.ts
    │   └── cn.ts
    │
    ├── constants/              ← Configuration
    │   └── config.ts
    │
    └── supabase/               ← Database client
        └── client.ts
```

---

## 🎯 Common Tasks

### 1. Add Authentication to a Page

```typescript
import { useAuth } from "@/hooks/useAuth";

export default function MyPage() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <Spinner />;
  if (!isAuthenticated) return <div>Please log in</div>;

  return <div>Welcome {user.email}</div>;
}
```

### 2. Fetch and Display Chat Sessions

```typescript
import { useChatSessions } from "@/hooks/useChatSessions";

export default function SessionList() {
  const { user } = useUser();
  const { sessions, loading } = useChatSessions(user?.id);

  if (loading) return <Spinner />;

  return (
    <div>
      {sessions.map(session => (
        <div key={session.id}>{session.title}</div>
      ))}
    </div>
  );
}
```

### 3. Send a Chat Message

```typescript
import { useChatMessages } from "@/hooks/useChatMessages";
import { aiService } from "@/lib/services/ai.service";

export default function ChatPage() {
  const { messages, addMessage } = useChatMessages(sessionId);
  const { user } = useUser();

  const handleSend = async (content: string) => {
    // Add user message
    await addMessage("user", content);

    // Get AI response
    const reply = await aiService.generateResponse({
      messages: [...messages, { role: "user", content }],
      userId: user.id,
    });

    // Add AI response
    await addMessage("ai", reply);
  };

  return <ChatInput onSendMessage={handleSend} />;
}
```

### 4. Upload a File

```typescript
import { useFileUpload } from "@/hooks/useFileUpload";

export default function FileUploader() {
  const { user } = useUser();
  const { uploadFile, status, isUploading } = useFileUpload();

  const handleUpload = async (file: File) => {
    const result = await uploadFile(file, user.id);
    console.log("Uploaded:", result.fileName);
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {status.message && <p>{status.message}</p>}
    </div>
  );
}
```

### 5. Create a New Chat Session

```typescript
import { chatService } from "@/lib/services/chat.service";

const newSession = await chatService.createChatSession(
  userId,
  "My New Chat"
);

router.push(`/chat/${newSession.id}`);
```

### 6. Get User Documents

```typescript
import { useDocuments } from "@/hooks/useDocuments";

export default function DocumentList() {
  const { user } = useUser();
  const { documents, loading } = useDocuments(user?.id);

  if (loading) return <Spinner />;

  return (
    <div>
      {documents.map(doc => (
        <div key={doc.id}>{doc.file_name}</div>
      ))}
    </div>
  );
}
```

---

## 🔑 Key Imports

### Hooks
```typescript
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { useChatSessions } from "@/hooks/useChatSessions";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useDocuments } from "@/hooks/useDocuments";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAutoScroll } from "@/hooks/useAutoScroll";
```

### Services
```typescript
import { authService } from "@/lib/services/auth.service";
import { chatService } from "@/lib/services/chat.service";
import { documentService } from "@/lib/services/document.service";
import { aiService } from "@/lib/services/ai.service";
```

### Types
```typescript
import type { User } from "@/lib/types/user.types";
import type { ChatSession, ChatMessage } from "@/lib/types/chat.types";
import type { UserDocument } from "@/lib/types/document.types";
```

### Config
```typescript
import { APP_CONFIG, DATABASE_TABLES, STORAGE_BUCKETS } from "@/lib/constants/config";
```

### Components
```typescript
import { ChatMessage } from "@/components/chat/ChatMessage";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AuthForm } from "@/components/auth/AuthForm";
```

---

## 🎨 Component Patterns

### 1. Presentational Component
```typescript
interface Props {
  data: string;
  onClick: () => void;
}

export function MyComponent({ data, onClick }: Props) {
  return <button onClick={onClick}>{data}</button>;
}
```

### 2. Container Component
```typescript
export function MyContainer() {
  const { data, loading } = useMyHook();
  const handleClick = () => { /* logic */ };

  if (loading) return <Spinner />;

  return <MyComponent data={data} onClick={handleClick} />;
}
```

### 3. Layout Component
```typescript
interface Props {
  children: React.ReactNode;
}

export function MyLayout({ children }: Props) {
  return (
    <div className="layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
```

---

## 🔧 Configuration

### Environment Variables (.env)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

### App Config (lib/constants/config.ts)
```typescript
APP_CONFIG.CHUNK_SIZE              // 800
APP_CONFIG.MAX_MATCH_COUNT         // 5
APP_CONFIG.DEFAULT_CHAT_TITLE      // "New Chat"
APP_CONFIG.GEMINI_EMBEDDING_MODEL  // "gemini-embedding-001"
APP_CONFIG.GEMINI_CHAT_MODEL       // "gemini-flash-latest"
```

---

## 🐛 Debugging Tips

### 1. Check User Authentication
```typescript
const { user } = useUser();
console.log("Current user:", user);
```

### 2. Check Chat Messages
```typescript
const { messages, loading, error } = useChatMessages(sessionId);
console.log("Messages:", messages);
console.log("Loading:", loading);
console.log("Error:", error);
```

### 3. Check File Upload Status
```typescript
const { status } = useFileUpload();
console.log("Upload status:", status);
```

### 4. Check API Responses
```typescript
// In API route
console.log("Request body:", await req.json());
console.log("Response:", { reply });
```

---

## 📊 Database Schema Quick Reference

### Tables
```sql
chat_sessions
├── id (uuid)
├── user_id (uuid)
├── title (text)
└── created_at (timestamp)

messages
├── id (uuid)
├── session_id (uuid)
├── role (text: "user" | "ai")
├── content (text)
└── created_at (timestamp)

user_documents
├── id (uuid)
├── user_id (uuid)
├── file_name (text)
├── file_path (text)
└── created_at (timestamp)

document_chunks
├── id (uuid)
├── user_id (uuid)
├── file_name (text)
├── content (text)
├── embedding (vector)
└── created_at (timestamp)
```

---

## 🚀 Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Build for Production
```bash
npm run build
```

### 3. Run Linter
```bash
npm run lint
```

### 4. Type Check
```bash
npx tsc --noEmit
```

---

## 📝 Code Style Guidelines

### 1. Naming Conventions
- **Components**: PascalCase (`ChatMessage`)
- **Hooks**: camelCase with `use` prefix (`useAuth`)
- **Services**: camelCase with `.service` suffix (`auth.service.ts`)
- **Types**: PascalCase (`ChatSession`)
- **Constants**: UPPER_SNAKE_CASE (`APP_CONFIG`)

### 2. File Organization
- One component per file
- Co-locate related files
- Use index files for exports

### 3. Import Order
```typescript
// 1. React imports
import { useState } from "react";

// 2. Third-party imports
import { useRouter } from "next/navigation";

// 3. Internal imports (hooks)
import { useAuth } from "@/hooks/useAuth";

// 4. Internal imports (components)
import { ChatInput } from "@/components/chat/ChatInput";

// 5. Internal imports (services)
import { chatService } from "@/lib/services/chat.service";

// 6. Internal imports (types)
import type { ChatMessage } from "@/lib/types/chat.types";
```

---

## ⚡ Performance Tips

### 1. Use Optimistic Updates
```typescript
// Add message immediately, sync later
addOptimisticMessage("user", content);
await saveToDatabase(content);
```

### 2. Lazy Load Services
```typescript
const { chatService } = await import("@/lib/services/chat.service");
```

### 3. Memoize Expensive Computations
```typescript
const expensiveValue = useMemo(() => computeValue(data), [data]);
```

### 4. Use Auto-scroll Hook
```typescript
const bottomRef = useAutoScroll<HTMLDivElement>([messages]);
```

---

## 🔒 Security Best Practices

### 1. Always Validate User
```typescript
const { user } = useUser();
if (!user) return null;
```

### 2. Use Row Level Security (RLS)
- Configured in Supabase
- Users can only access their own data

### 3. Validate Input
```typescript
if (!email || !password) {
  throw new Error("Missing required fields");
}
```

### 4. Use Service Role Key Carefully
- Only in API routes
- Never expose to client

---

## 📚 Additional Resources

- **Full Refactoring Details**: See `REFACTORING_SUMMARY.md`
- **Architecture Overview**: See `ARCHITECTURE.md`
- **Hooks & Utilities Reference**: See `HOOKS_AND_UTILITIES.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Gemini AI Docs**: https://ai.google.dev/docs

---

## 🆘 Common Issues & Solutions

### Issue: User not authenticated
**Solution**: Check if user is logged in
```typescript
const { user, isAuthenticated } = useAuth();
if (!isAuthenticated) router.push("/auth");
```

### Issue: Messages not loading
**Solution**: Check session ID
```typescript
const { messages, error } = useChatMessages(sessionId);
console.log("Error:", error);
```

### Issue: File upload fails
**Solution**: Check file size and type
```typescript
const isValid = validateFileSize(file, 10); // 10MB max
const isTypeOk = validateFileType(file, ["application/pdf"]);
```

### Issue: Build fails
**Solution**: Run type check
```bash
npx tsc --noEmit
```

---

**Happy coding! 🎉**

For detailed information, refer to the comprehensive documentation files.
