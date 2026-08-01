import { createFileRoute } from "@tanstack/react-router";
import { Copy, Download, QrCode, Share2 } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVENT } from "@/lib/event";

const title = "Event QR Code & Registration Link | IMC";
const description =
  "Scan, download or share the QR code for the Influencers Nations Membership Class registration form.";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: QrPage,
});

function QrPage() {
  const [link, setLink] = useState("");
  const [dataUrl, setDataUrl] = useState("");

  // The QR must encode the live origin, so it is generated after hydration.
  useEffect(() => {
    const url = `${window.location.origin}/register`;
    setLink(url);
    QRCode.toDataURL(url, {
      width: 720,
      margin: 2,
      color: { dark: "#1a2a6c", light: "#ffffff" },
      errorCorrectionLevel: "H",
    })
      .then(setDataUrl)
      .catch(() => toast.error("Could not generate the QR code."));
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Registration link copied");
    } catch {
      toast.error("Copy failed — please copy the link manually.");
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: EVENT.name, text: EVENT.tagline, url: link });
      } catch {
        /* user dismissed the share sheet */
      }
      return;
    }
    void copyLink();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <header className="text-center">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Invite</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Event QR Code</h1>
        <p className="mt-3 text-muted-foreground">
          Print it, project it or share the link — anyone who scans lands straight on the
          registration form.
        </p>
      </header>

      <Card className="mt-10 rounded-3xl border-border/70 shadow-elegant">
        <CardHeader className="items-center pb-2">
          <CardTitle className="font-display text-2xl">{EVENT.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="grid size-64 place-items-center rounded-2xl border border-border bg-background p-3 sm:size-72">
            {dataUrl ? (
              <img
                src={dataUrl}
                alt="QR code linking to the registration form"
                width={720}
                height={720}
                className="size-full"
              />
            ) : (
              <QrCode className="size-16 animate-pulse text-muted-foreground" aria-hidden />
            )}
          </div>

          <p className="w-full rounded-xl bg-secondary px-4 py-3 text-center text-sm break-all">
            {link || "Loading link…"}
          </p>

          <div className="grid w-full gap-3 sm:grid-cols-3">
            <Button asChild size="lg" className="h-13 rounded-full text-base" disabled={!dataUrl}>
              <a href={dataUrl || undefined} download="imc-registration-qr.png">
                <Download className="mr-2 size-5" aria-hidden /> Download
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 rounded-full text-base"
              onClick={copyLink}
            >
              <Copy className="mr-2 size-5" aria-hidden /> Copy link
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-13 rounded-full text-base"
              onClick={share}
            >
              <Share2 className="mr-2 size-5" aria-hidden /> Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
