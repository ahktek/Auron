import fs from "fs";
import path from "path";

export interface SupportMessage {
  id: string;
  ticketId: string;
  name: string;
  email: string;
  phone?: string;
  topic: string;
  orderNumber?: string;
  message: string;
  createdAt: string;
  status: "new" | "in_progress" | "replied" | "resolved";
  adminNotes?: string;
  replyMethod?: "email" | "whatsapp" | "phone";
  repliedAt?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

function ensureDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      // Ignore if directory creation fails in restricted environment
    }
  }
}

function safeReadJSON<T>(filePath: string): T | null {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const clean = raw.replace(/^\uFEFF/, "").trim();
      if (clean) {
        return JSON.parse(clean) as T;
      }
    }
  } catch (err) {
    console.warn(`Failed to parse JSON from ${filePath}:`, err);
  }
  return null;
}

export function getStoredMessages(): SupportMessage[] {
  try {
    ensureDirectory();
    const parsed = safeReadJSON<SupportMessage[]>(MESSAGES_FILE);
    if (Array.isArray(parsed)) {
      return parsed.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return [];
  } catch (err) {
    console.warn("Failed to read messages file:", err);
    return [];
  }
}

export function saveSupportMessage(msgData: Omit<SupportMessage, "id" | "ticketId" | "createdAt" | "status">): SupportMessage {
  ensureDirectory();
  const current = getStoredMessages();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const ticketId = `CC-MSG-${randomSuffix}`;

  const newMessage: SupportMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ticketId,
    name: msgData.name.trim(),
    email: msgData.email.trim().toLowerCase(),
    phone: msgData.phone?.trim() || "",
    topic: msgData.topic || "General Inquiry",
    orderNumber: msgData.orderNumber?.trim() || "",
    message: msgData.message.trim(),
    createdAt: new Date().toISOString(),
    status: "new",
  };

  const updated = [newMessage, ...current];
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write message to file:", err);
  }

  return newMessage;
}

export function updateSupportMessageStatus(
  id: string,
  status: SupportMessage["status"],
  adminNotes?: string,
  replyMethod?: SupportMessage["replyMethod"]
): SupportMessage | null {
  ensureDirectory();
  const current = getStoredMessages();
  const index = current.findIndex((m) => m.id === id);
  if (index === -1) return null;

  const target = current[index];
  const updatedItem: SupportMessage = {
    ...target,
    status,
    adminNotes: adminNotes !== undefined ? adminNotes : target.adminNotes,
    replyMethod: replyMethod !== undefined ? replyMethod : target.replyMethod,
    repliedAt: status === "replied" || status === "resolved" ? new Date().toISOString() : target.repliedAt,
  };

  current[index] = updatedItem;
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(current, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to update message status:", err);
  }

  return updatedItem;
}

export function deleteStoredMessage(id: string): boolean {
  ensureDirectory();
  const current = getStoredMessages();
  const updated = current.filter((m) => m.id !== id);
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to delete message:", err);
    return false;
  }
}
