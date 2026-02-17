import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ForgeFabric AI",
  description: "Enterprise Agent Runtime + Governance Fabric",
};

function ClerkWrapper({ children }: { children: React.ReactNode }) {
  // Only wrap with ClerkProvider if key is configured
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!clerkKey) {
    return <>{children}</>;
  }

  // Dynamic import to avoid build errors when @clerk/nextjs is not installed
  try {
    const { ClerkProvider } = require("@clerk/nextjs");
    const { dark } = require("@clerk/themes");
    return (
      <ClerkProvider appearance={{ baseTheme: dark }} publishableKey={clerkKey}>
        {children}
      </ClerkProvider>
    );
  } catch {
    return <>{children}</>;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white">
        <ClerkWrapper>{children}</ClerkWrapper>
      </body>
    </html>
  );
}
