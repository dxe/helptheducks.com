"use client";

import { useScrollToId } from "@dxe/petitions-components/use-scroll-to-id";
import { Button } from "@dxe/petitions-components/button";
import { EmailPetition } from "@dxe/email-petition/email-petition";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@dxe/petitions-components/dialog";
import { PlayIcon } from "@/svg/play-icon";
import { Section } from "@dxe/petitions-components/section";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DEFAULT_MESSAGE } from "@/data/petition-message";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 items-center">
      <Hero />
      <PetitionSection />
      <Footer />
    </div>
  );
}

function onSubmit() {
  window.dataLayer?.push({
    event: "form_submitted",
  });
}

const Hero = () => {
  const scrollToPetition = useScrollToId("petition-section");

  return (
    <section
      className="md:min-h-[90vh] w-full text-white lg:bg-center md:bg-[40%] bg-[45%] bg-cover flex flex-col"
      style={{
        backgroundImage: `url(/img/hero.png)`,
      }}
    >
      <div className="bg-black/40 w-full grow flex justify-center items-center md:px-12 py-12">
        <div className="flex flex-col gap-9 max-w-(--breakpoint-xl) md:border-l-2 p-6 w-full">
          <div className="flex flex-col gap-4">
            <h1 className="uppercase text-2xl md:text-5xl leading-[1.125] tracking-wide max-w-[16rem] md:max-w-md border-b-2 md:border-0 py-4 md:py-0">
              Perdue’s Petaluma Poultry Criminally Abuses Chickens
            </h1>
            <p className="font-medium max-w-lg">
              Investigations since 2018 have exposed sick and injured animals
              languishing without care.
            </p>
          </div>
          <Button
            className="self-start"
            variant="secondary"
            size="lg"
            onClick={scrollToPetition}
          >
            Ask Petaluma City Council to Stop the Abuse
          </Button>
        </div>
      </div>
    </section>
  );
};

const PetitionSection = () => {
  return (
    <Section
      className="gap-12 items-center bg-slate-200 xl:rounded-lg py-12 md:px-16"
      id="petition-section"
    >
      <h2 className="font-semibold text-xl uppercase self-start text-center md:text-left w-full">
        Ask Petaluma City Council to shut down Perdue's slaughterhouse
      </h2>
      <EmailPetition defaultMessage={DEFAULT_MESSAGE} onSubmit={onSubmit} />
    </Section>
  );
};

const Footer = () => {
  return (
    <Section className="text-center pt-4 pb-12 text-sm md:border-t border-slate-300 text-slate-600">
      &copy; {new Date().getFullYear()} Help The Chickens
    </Section>
  );
};
