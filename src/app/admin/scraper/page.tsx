"use client";

import { useState } from "react";
import { scrapeInstagramAccount, aggregateCompetitionsGrounded } from "@/actions/scraper.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ScraperAdminPage() {
  const [loadingIg, setLoadingIg] = useState(false);
  const [loadingGrounded, setLoadingGrounded] = useState(false);
  const [igUsername, setIgUsername] = useState("");
  const [searchTopic, setSearchTopic] = useState("Hackathon dan Business Plan Mahasiswa");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleScrapeIg(e: React.FormEvent) {
    e.preventDefault();
    if (!igUsername) return;
    
    setLoadingIg(true);
    setMessage(null);
    try {
      const res = await scrapeInstagramAccount(igUsername);
      if (res.success) {
        setMessage({ type: "success", text: res.message || "Sukses" });
      } else {
        setMessage({ type: "error", text: res.error || "Terjadi kesalahan" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setLoadingIg(false);
    }
  }

  async function handleGroundedSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchTopic) return;

    setLoadingGrounded(true);
    setMessage(null);
    try {
      const res = await aggregateCompetitionsGrounded(searchTopic);
      if (res.success) {
        setMessage({ type: "success", text: res.message || "Sukses" });
      } else {
        setMessage({ type: "error", text: res.error || "Terjadi kesalahan" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setLoadingGrounded(false);
    }
  }

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Competition Aggregator</h1>
        <p className="text-muted-foreground mt-2">
          Gunakan tools di bawah ini untuk menarik data kompetisi secara otomatis dan menyimpannya ke database BeeMate.
        </p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className={message.type === "success" ? "border-green-500 text-green-700" : ""}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 stroke-green-500" />}
          <AlertTitle>{message.type === "error" ? "Error" : "Berhasil"}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* CARD 1: Google Search Grounding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Google Search Grounding
            </CardTitle>
            <CardDescription>
              Gemini AI akan mencari info lomba di seluruh web secara real-time via Google Search. (Opsi A)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGroundedSearch} className="space-y-4">
              <div className="space-y-2">
                <Label>Topik Pencarian</Label>
                <Input 
                  placeholder="Contoh: Hackathon UI/UX Mahasiswa 2026" 
                  value={searchTopic}
                  onChange={(e) => setSearchTopic(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loadingGrounded || loadingIg} className="w-full">
                {loadingGrounded ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                {loadingGrounded ? "Mencari & Mengekstrak..." : "Jalankan Pencarian"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* CARD 2: Instagram RapidAPI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Instagram Scraper
            </CardTitle>
            <CardDescription>
              Mengambil postingan dari akun spesifik dan mengekstrak info lomba pakai Gemini AI. (Opsi B)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScrapeIg} className="space-y-4">
              <div className="space-y-2">
                <Label>Username Akun Instagram target</Label>
                <Input 
                  placeholder="Contoh: @infomahasiswa" 
                  value={igUsername}
                  onChange={(e) => setIgUsername(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loadingIg || loadingGrounded} variant="secondary" className="w-full">
                {loadingIg && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loadingIg ? "Scraping Akun..." : "Scrape Instagram"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
