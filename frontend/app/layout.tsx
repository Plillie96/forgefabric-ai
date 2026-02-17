import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "ForgeFabric AI",
  description: "Enterprise Agent Runtime + Governance Fabric",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const content = (
    <html lang="en">
      <body className="bg-zinc-950 text-white">{children}</body>
    </html>
  );

  if (!clerkKey) {
    return content;
  }

  return (
    <ClerkProvider appearance={{ baseTheme: dark }} publishableKey={clerkKey}>
      {content}
    </ClerkProvider>
  );
}
