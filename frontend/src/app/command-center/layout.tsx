import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snap OS | Your Ultimate Web Workspace & Dashboard",
  description: "Snap OS is a customizable, drag-and-drop web operating system. Manage your deep links, secure files, digital business cards, and productivity tools in one place.",
  keywords: ["Snap OS", "web operating system", "bento dashboard", "productivity dashboard", "link manager", "file manager"],
  openGraph: {
    title: "Snap OS | Your Ultimate Web Workspace",
    description: "A fully customizable, drag-and-drop web operating system. Manage links, files, and tools all in one place.",
    url: "https://www.snaplinks.in/command-center",
  },
  alternates: {
    canonical: "https://www.snaplinks.in/command-center",
  }
};

export default function CommandCenterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
