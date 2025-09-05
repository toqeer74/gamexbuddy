import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Inbox, Users } from "lucide-react";

interface Message {
  id: number;
  sender_id: string;
  recipient_id: string;
  subject: string;
  body: string;
  created_at: string;
  read_at: string | null;
  sender_username?: string;
  recipient_username?: string;
}

interface Conversation {
  id: number;
  subject: string;
  last_message_at: string;
  unread_count: number;
  participant: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export default function PrivateMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: "",
    subject: "",
    body: ""
  });

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get all messages involving the user
    const { data: messages } = await supabase
      .from("private_messages")
      .select(`
        *,
        sender:profiles!private_messages_sender_id_fkey(username, avatar_url),
        recipient:profiles!private_messages_recipient_id_fkey(username, avatar_url)
      `)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (messages) {
      // Group into conversations
      const conversationMap = new Map<string, Message[]>();

      messages.forEach(msg => {
        const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
        const key = `${Math.min(user.id, otherUserId)}-${Math.max(user.id, otherUserId)}`;

        if (!conversationMap.has(key)) {
          conversationMap.set(key, []);
        }
        conversationMap.get(key)!.push(msg);
      });

      const conversationsArr: Conversation[] = [];
      conversationMap.forEach(messageGroup => {
        const lastMessage = messageGroup[0];
        const otherUser = lastMessage.sender_id === user.id ? lastMessage.recipient : lastMessage.sender;

        conversationsArr.push({
          id: parseInt(lastMessage.id.toString()),
          subject: lastMessage.subject,
          last_message_at: lastMessage.created_at,
          unread_count: messageGroup.filter(m => m.recipient_id === user.id && !m.read_at).length,
          participant: {
            id: otherUser.id || '',
            username: otherUser.username || 'Unknown',
            avatar_url: otherUser.avatar_url
          }
        });
      });

      setConversations(conversationsArr.sort((a, b) =>
        new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      ));
    }
  };

  const loadMessages = async (conversationId: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const { data } = await supabase
      .from("private_messages")
      .select(`
        *,
        sender:profiles!private_messages_sender_id_fkey(username),
        recipient:profiles!private_messages_recipient_id_fkey(username)
      `)
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${conversation.participant.id}),and(sender_id.eq.${conversation.participant.id},recipient_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    setMessages(data || []);

    // Mark messages as read
    await supabase
      .from("private_messages")
      .update({ read_at: new Date().toISOString() })
      .eq("recipient_id", user.id)
      .eq("sender_id", conversation.participant.id);
  };

  const sendMessage = async () => {
    if (!newMessage.recipient || !newMessage.body.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Find recipient by username
    const { data: recipient } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", newMessage.recipient.toLowerCase())
      .single();

    if (!recipient) {
      alert("Recipient not found");
      return;
    }

    const { error } = await supabase
      .from("private_messages")
      .insert({
        sender_id: user.id,
        recipient_id: recipient.id,
        subject: newMessage.subject || "No subject",
        body: newMessage.body.trim()
      });

    if (!error) {
      setNewMessage({ recipient: "", subject: "", body: "" });
      setShowCompose(false);
      loadConversations();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent">
          🎮 Private Messages
        </h1>
        <Button
          onClick={() => setShowCompose(!showCompose)}
          variant="neon"
          className="flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          {showCompose ? "Cancel" : "Compose"}
        </Button>
      </div>

      {showCompose && (
        <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
          <CardHeader>
            <CardTitle className="text-primary">New Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Recipient username"
              value={newMessage.recipient}
              onChange={(e) => setNewMessage(prev => ({ ...prev, recipient: e.target.value }))}
              className="bg-white/5 border-white/20"
            />
            <Input
              placeholder="Subject (optional)"
              value={newMessage.subject}
              onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
              className="bg-white/5 border-white/20"
            />
            <Textarea
              placeholder="Message..."
              value={newMessage.body}
              onChange={(e) => setNewMessage(prev => ({ ...prev, body: e.target.value }))}
              rows={4}
              className="bg-white/5 border-white/20"
            />
            <Button onClick={sendMessage} variant="neon" className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1 border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Inbox className="w-5 h-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="text-white/50 text-center py-4">No conversations yet</p>
              ) : (
                conversations.map(convo => (
                  <div
                    key={convo.id}
                    onClick={() => {
                      setSelectedConversation(convo.id);
                      loadMessages(convo.id);
                    }}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all duration-200
                      ${selectedConversation === convo.id
                        ? 'bg-primary/20 border border-primary/30'
                        : 'hover:bg-white/10 hover:border-white/10'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium">{convo.participant.username}</p>
                        <p className="text-white/60 text-sm truncate">{convo.subject}</p>
                      </div>
                      {convo.unread_count > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          {convo.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-white/40 text-xs mt-1">
                      {new Date(convo.last_message_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Messages View */}
        <Card className="lg:col-span-2 border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
          <CardHeader>
            {selectedConversation ? (
              <CardTitle className="text-primary">
                {conversations.find(c => c.id === selectedConversation)?.participant.username}
              </CardTitle>
            ) : (
              <CardTitle className="text-white/50">Select a conversation</CardTitle>
            )}
          </CardHeader>
          <CardContent>
            {selectedConversation ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map(message => (
                  <div key={message.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-sm">
                        {message.sender_id === conversations.find(c => c.id === selectedConversation)?.participant.id
                          ? message.sender.username || message.sender
                          : "You"}
                      </span>
                      <span className="text-white/40 text-xs">
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                    </div>
                    {message.subject !== "No subject" && (
                      <p className="text-primary font-medium mb-2">{message.subject}</p>
                    )}
                    <p className="text-white leading-relaxed">{message.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-white/50">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                Select a conversation to view messages
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}