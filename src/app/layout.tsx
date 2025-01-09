import "@/styles/globals.css"
import { GeistSans } from "geist/font/sans"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`light ${GeistSans.className}`}>
      <body>{children}</body>
    </html>
  )
}
