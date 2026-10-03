export const metadata = { title: "Support", robots: { index: false, follow: false } };
export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:pt-36">{children}</div>;
}
