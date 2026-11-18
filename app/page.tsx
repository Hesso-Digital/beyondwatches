import TopBar from "@/components/TopBar";
import Intro from "@/components/Intro";
import SmoothScroll from "@/components/SmoothScroll";
import Journey from "@/components/Journey";
import ExplodedTeaser from "@/components/ExplodedTeaser";
import Story from "@/components/Story";
import ClaimFlow from "@/components/ClaimFlow";
import Wall from "@/components/Wall";
import Footer from "@/components/Footer";
import { EditionProvider } from "@/components/EditionProvider";

export default function Home() {
  return (
    <>
      <a className="skip" href="#claim">Skip to Claim your number</a>
      <Intro />
      <SmoothScroll />
      <TopBar />
      <main>
        <Journey />
        <ExplodedTeaser />
        <Story />
        <EditionProvider>
          <ClaimFlow />
          <Wall />
        </EditionProvider>
      </main>
      <Footer />
    </>
  );
}
