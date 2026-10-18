import { site } from "@/data/site";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <h1 className="font-serif text-5xl">{site.name}</h1>
      {/* TEMP: remove later */}
      <div className="min-h-[300vh]" />
    </main>
  );
}
