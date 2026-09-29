import { createFileRoute } from "@tanstack/react-router";
import { CopperApp } from "@/components/cr/CopperApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Copper Road Maine Coons" },
      {
        name: "description",
        content: "Breeding healthy, happy Maine Coon cats. Discover kittens, apply to adopt, and shop Copper Road.",
      },
    ],
  }),
  component: CopperApp,
});
