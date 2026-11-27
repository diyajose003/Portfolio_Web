import Portfolio from "@/components/Portfolio";
import { loadContent } from "@/lib/content";

export default async function HomePage() {
  const content = await loadContent();
  return <Portfolio {...content} />;
}
