import Header from "@/components/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container" style={{ padding: "2rem 1.5rem", flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
