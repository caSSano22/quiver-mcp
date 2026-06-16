import './globals.css';

export const metadata = {
  title: 'Quiver — the directory for AI agent tools',
  description:
    'Discover, review, and rate MCP servers powering the agent economy. Quiver is the trust layer for the tools your agent will install next.',
  metadataBase: new URL('https://quiver.mcp'),
  openGraph: {
    title: 'Quiver — the directory for AI agent tools',
    description:
      'Discover, review, and rate MCP servers powering the agent economy.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quiver — the directory for AI agent tools',
    description:
      'Discover, review, and rate MCP servers powering the agent economy.',
  },
};

export const viewport = {
  themeColor: '#06070a',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased">
        <div className="grid-bg pointer-events-none fixed inset-0 -z-10" />
        {children}
      </body>
    </html>
  );
}
