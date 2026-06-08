"use client"

import { useState, useEffect, useRef } from "react"
import { getTeamMessages, sendTeamMessage } from "@/actions"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { buttonVariants } from "@/components/ui/button";

interface ChatMember {
  userId: string
  user: {
    name: string | null
    image: string | null
  }
}

interface ChatLeader {
  id: string
  name: string | null
  image: string | null
}

interface TeamChatProps {
  teamId: string
  currentUserId: string
  members: ChatMember[]
  leader: ChatLeader
}

interface MessageData {
  id: string
  content: string
  senderId: string
  createdAt: string | Date
  sender?: {
    id: string
    name: string | null
    image: string | null
  }
}

export function TeamChat({ teamId, currentUserId, members, leader }: TeamChatProps) {
  const [messages, setMessages] = useState<MessageData[]>([])
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)

  // Lookup sender info helper
  const getSenderInfo = (senderId: string) => {
    if (senderId === leader.id) {
      return {
        name: leader.name || "Leader",
        image: leader.image,
      }
    }
    const member = members.find((m) => m.userId === senderId)
    return {
      name: member?.user.name || "Anggota Tim",
      image: member?.user.image || null,
    }
  }

  useEffect(() => {
    fetchMessages()

    // Setup Supabase Realtime subscription
    let channel: ReturnType<ReturnType<typeof getSupabaseBrowserClient>["channel"]> | null = null
    try {
      const supabase = getSupabaseBrowserClient()
      channel = supabase
        .channel(`team-chat:${teamId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "Message",
            filter: `teamId=eq.${teamId}`,
          },
          (payload) => {
            const newMsg = payload.new as MessageData
            
            // Avoid duplicate messages if already present in state
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev
              
              // Enrich with local sender data
              const senderData = getSenderInfo(newMsg.senderId)
              const enrichedMsg: MessageData = {
                ...newMsg,
                sender: {
                  id: newMsg.senderId,
                  name: senderData.name,
                  image: senderData.image,
                },
              }
              return [...prev, enrichedMsg]
            })
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setConnected(true)
          } else {
            setConnected(false)
          }
        })
    } catch (err) {
      console.error("Realtime subscription error:", err)
    }

    return () => {
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [teamId])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const res = await getTeamMessages(teamId)
      if (res.success && res.data) {
        setMessages(res.data as unknown as MessageData[])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || sending) return

    const textToSend = inputText.trim()
    setInputText("")
    setSending(true)

    try {
      const res = await sendTeamMessage(teamId, textToSend)
      if (!res.success) {
        alert(res.error || "Gagal mengirim pesan")
        setInputText(textToSend) // Restore text on failure
      }
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan koneksi")
      setInputText(textToSend)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateStr: string | Date) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  }

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--bdr)",
        borderRadius: "24px",
        height: "600px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--bdr)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <i className="ph-fill ph-chat-circle-text" style={{ fontSize: "20px", color: "var(--ho)" }}></i>
          <span style={{ fontWeight: 800, color: "var(--t)" }}>Team Chat Room</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: connected ? "#10b981" : "#f5a623",
              boxShadow: connected ? "0 0 8px #10b981" : "0 0 8px #f5a623",
            }}
          />
          <span style={{ fontSize: "11px", color: "var(--t2)", fontWeight: 600 }}>
            {connected ? "Real-time Connected" : "Connecting..."}
          </span>
        </div>
      </div>

      {/* Message Area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          padding: "24px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          background: "rgba(0,0,0,0.02)",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ margin: "auto", textAlign: "center", color: "var(--t3)", padding: "20px" }}>
            <i className="ph-fill ph-chat" style={{ fontSize: "48px", marginBottom: "12px", display: "block" }}></i>
            <p style={{ fontSize: "14px" }}>Belum ada pesan di tim ini. Mulai obrolan sekarang!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSelf = msg.senderId === currentUserId
            const senderName = msg.sender?.name || "Anggota Tim"
            const senderImage = msg.sender?.image

            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: isSelf ? "flex-end" : "flex-start",
                  gap: "10px",
                  maxWidth: "80%",
                  alignSelf: isSelf ? "flex-end" : "flex-start",
                }}
              >
                {!isSelf && (
                  <div style={{ alignSelf: "flex-end", flexShrink: 0 }}>
                    {senderImage ? (
                      <img
                        src={senderImage}
                        alt={senderName}
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "var(--ho)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {getInitials(senderName)}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", alignItems: isSelf ? "flex-end" : "flex-start" }}>
                  {!isSelf && (
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--t2)", marginBottom: "4px", marginLeft: "4px" }}>
                      {senderName}
                    </span>
                  )}
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: isSelf ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: isSelf ? "linear-gradient(135deg, #f5a623, #ffb83d)" : "var(--bg)",
                      border: isSelf ? "none" : "1px solid var(--bdr)",
                      color: isSelf ? "#fff" : "var(--t)",
                      boxShadow: isSelf ? "0 4px 12px rgba(245, 166, 35, 0.15)" : "none",
                      fontSize: "14px",
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--t3)", marginTop: "4px", marginRight: isSelf ? "4px" : "0", marginLeft: isSelf ? "0" : "4px" }}>
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        style={{
          padding: "16px 24px",
          background: "var(--bg)",
          borderTop: "1px solid var(--bdr)",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tulis pesan..."
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "100px",
            border: "1px solid var(--bdr)",
            background: "var(--bg2)",
            color: "var(--t)",
            fontSize: "14px",
            outline: "none",
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className={buttonVariants({ variant: "honey" })}
          style={{
            borderRadius: "50%",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            flexShrink: 0,
          }}
        >
          <i className="ph-fill ph-paper-plane-right" style={{ fontSize: "18px" }}></i>
        </button>
      </form>
    </div>
  )
}
