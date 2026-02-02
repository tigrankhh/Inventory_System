import "./globals.css";

export const metadata = {
  title: "Inventory System Pro",
  description: "Modern Asset Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}
