import { Metadata } from 'next';
import LandingContent from './LandingContent';

export const metadata: Metadata = {
  title: "OmniChat | The Ultimate Omnichannel Support Platform",
  description: "Scale your customer support with OmniChat. Unified inbox for WhatsApp, Messenger, Instagram, and more.",
  openGraph: {
    title: "OmniChat | The Ultimate Omnichannel Support Platform",
    description: "Scale your customer support with OmniChat. Unified inbox for WhatsApp, Messenger, Instagram, and more.",
    images: ["/images/hero.png"],
  },
};

export default function LandingPage() {
  return <LandingContent />;
}
