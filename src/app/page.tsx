import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <main>
      <h1 className="text-3xl font-bold underline">
        lets fkin build this shit!
      </h1>
      <Button>click me</Button>
      <ModeToggle />
    </main>
  );
}
