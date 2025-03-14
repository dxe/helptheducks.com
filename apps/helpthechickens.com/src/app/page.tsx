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
      <AboutSection />
      <Video1Section />
      <Video2Section />
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
        backgroundImage: `url(/img/hero.jpeg)`,
      }}
    >
      <div className="bg-black/40 w-full grow flex justify-center items-center md:px-12 py-12">
        <div className="flex flex-col gap-9 max-w-(--breakpoint-xl) md:border-l-2 p-6 w-full">
          <div className="flex flex-col gap-4">
            <h1 className="uppercase text-2xl md:text-5xl leading-[1.125] tracking-wide max-w-[16rem] md:max-w-md border-b-2 md:border-0 py-4 md:py-0">
              The Reichardt Factory Farm Leaves Diseased Ducks to Die
            </h1>
            <p className="font-medium max-w-lg">
              Multiple investigations have exposed Reichardt Duck Farm for
              rampant disease and criminal animal cruelty.
            </p>
          </div>
          <Button
            className="self-start"
            variant="secondary"
            size="lg"
            onClick={scrollToPetition}
          >
            Tell the DA to prosecute Reichardt
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
        Contact the District Attorney Now
      </h2>
      <EmailPetition defaultMessage={DEFAULT_MESSAGE} onSubmit={onSubmit} />
    </Section>
  );
};

const AboutSection = () => {
  return (
    <Section>
      <h2 className="border-b border-slate-300 pb-2 uppercase text-lg tracking-wide text-slate-800">
        About Reichardt Duck Farm
      </h2>
      <div className="flex flex-col lg:flex-row items-center justify-evenly gap-12 text-center">
        <div className="flex flex-col gap-6 max-w-xs w-full">
          <Image
            src='/img/about1.webp'
            className="rounded-full"
            alt="Duck 1"
            width={650}
            height={650}
          />
          <div className="flex flex-col gap-4">
            <div className="text-4xl uppercase font-semibold">Disease</div>
            <p>
              Testing has found dangerous diseases are rampant at Reichardt,
              including E. coli, Riemerella anatipestifer, Salmonella,
              Staphylococcus, Aerococcus viridans, and Pseudomonas aeruginosa.
              Some of these bacteria could spread to humans. Reichardt has poor
              biosecurity practices which contribute to this rampant disease.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6 max-w-xs w-full">
          <Image
            src='/img/about2.webp'
            className="rounded-full"
            alt="Duck 2"
            width={730}
            height={730}
          />
          <div className="flex flex-col gap-4">
            <div className="text-4xl uppercase font-semibold">Neglect</div>
            <p>
              Undercover investigations have exposed that Reichardt leaves
              diseased ducks to die without veterinary care. Many ducks develop
              balance issues from infection and fall on their backs, unable to
              right themselves. Without help, they slowly die of dehydration and
              starvation.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6 max-w-xs w-full">
          <Image
            src='/img/about3.webp'
            className="rounded-full"
            alt="Duck 3"
            width={680}
            height={680}
          />
          <div className="flex flex-col gap-4">
            <div className="text-4xl uppercase font-semibold">Abuse</div>
            <p>
              Ducks at Reichardt are denied proper housing. They don&apos;t have
              access to water to swim or float in or for cleaning their eyes and
              sinuses. They are crowded together in filthy barns, forced to
              spend every moment living on a wire floor that digs into their
              feet and causes painful injuries. Ducklings routinely get stuck in
              the wire.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
};

const Video1Section = () => {
  const scrollToPetition = useScrollToId("petition-section");

  return (
    <Section className="flex md:flex-row gap-8 text-center justify-evenly items-center bg-slate-200 xl:rounded-lg py-12 md:py-4">
      <div className="flex gap-6 flex-col items-center">
        <h4 className="text-3xl uppercase font-medium">
          Ducklings Trapped In Wire
        </h4>
        <p className="max-w-md">
          Investigators found dozens of ducklings trapped in wire on one night
          in October.
        </p>
        <Button size="lg" onClick={scrollToPetition} className="hidden md:flex">
          Tell the DA to prosecute Reichardt
        </Button>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="md:order-first max-w-[325px] relative">
            <PlayIcon className="absolute h-24 w-24 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <Image
              src='/img/video1.jpeg'
              className="aspect-square rounded-md"
              alt="Watch"
              width={728}
              height={728}
            />
          </button>
        </DialogTrigger>
        <DialogContent className="w-full flex justify-center bg-black">
          <VisuallyHidden>
            <DialogTitle>Watch video</DialogTitle>
          </VisuallyHidden>
          <iframe
            src="https://player.vimeo.com/video/899045165?h=2603019680&autoplay=1&title=0&byline=0&portrait=0&badge=0"
            allow="autoplay; fullscreen"
            allowFullScreen
            className="border-0 w-full h-full aspect-9/16 md:order-first max-h-[80vh]"
          ></iframe>
        </DialogContent>
      </Dialog>
      <Button size="lg" onClick={scrollToPetition} className="flex md:hidden">
        Tell the DA to prosecute Reichardt
      </Button>
    </Section>
  );
};

const Video2Section = () => {
  const scrollToPetition = useScrollToId("petition-section");

  return (
    <Section className="flex md:flex-row gap-8 text-center justify-evenly items-center bg-slate-200 xl:rounded-lg py-12 md:py-4">
      <div className="flex gap-6 flex-col items-center">
        <h4 className="text-3xl uppercase font-medium">Meet River</h4>
        <p className="max-w-md">
          River was on the verge of death at Reichardt Duck Farm. Investigators
          knew they couldn&apos;t leave him behind so they rushed him to the
          vet.
        </p>
        <Button size="lg" onClick={scrollToPetition} className="hidden md:flex">
          Tell the DA to prosecute Reichardt
        </Button>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="md:order-first max-w-[325px] relative">
            <PlayIcon className="absolute h-24 w-24 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <Image
              src='/img/video2.jpeg'
              className="aspect-square rounded-md"
              alt="Watch"
              width={728}
              height={728}
            />
          </button>
        </DialogTrigger>
        <DialogContent className="w-full flex justify-center bg-black">
          <VisuallyHidden>
            <DialogTitle>Watch video</DialogTitle>
          </VisuallyHidden>
          <iframe
            src="https://player.vimeo.com/video/899042025?h=d2d319d36b&autoplay=1&title=0&byline=0&portrait=0&badge=0"
            allow="autoplay; fullscreen"
            allowFullScreen
            className="border-0 w-full h-full aspect-9/16 md:order-first max-h-[80vh]"
          ></iframe>
        </DialogContent>
      </Dialog>
      <Button size="lg" onClick={scrollToPetition} className="flex md:hidden">
        Tell the DA to prosecute Reichardt
      </Button>
    </Section>
  );
};

const Footer = () => {
  return (
    <Section className="text-center pt-4 pb-12 text-sm md:border-t border-slate-300 text-slate-600">
      &copy; {new Date().getFullYear()} Help The Ducks
    </Section>
  );
};
