import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

// Persische Web-Schrift mit vollständiger Fa-Abdeckung. Wird über die
// CSS-Variable --font-vazirmatn als Standard-Schrift (siehe tailwind.config.ts)
// verwendet. `display: swap` + Fallback halten die App auch ohne geladene
// Schrift lesbar.
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  fallback: ["Tahoma", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  applicationName: "دیکته فارسی",
  title: "Persisch-Diktat",
  description: "Hör- und Diktatübungen für Persisch (Farsi), mit Cloud-Sync.",
  appleWebApp: {
    capable: true,
    title: "دیکته فارسی",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#239F40",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={vazirmatn.variable}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
