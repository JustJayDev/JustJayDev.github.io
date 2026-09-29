import { Hero } from '@/components/home/Hero';
import { HomeSections } from '@/components/home/sections';
import { useSeo } from '@/lib/seo';
import { site } from '@/content/site';

export default function Home() {
  useSeo('Home', site.description, '/');
  return (
    <>
      <div className="shell">
        <Hero />
        <HomeSections />
      </div>
    </>
  );
}