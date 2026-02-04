// This is the client component
import CityPageClient from "./CityPageClient";

export async function generateMetadata({ params }) {
  const { city } = await params;
  const cityNames = {
    riyadh: "مدينة الرياض",
    jeddah: "مدينة جدة",
    eastern: "المنطقة الشرقية",
  };
  const cityName = cityNames[city] || city;

  return {
    title: `تأجير سيارات في ${cityName} | C4R Platform`,
    description: `أفضل خيارات تأجير السيارات في ${cityName}. حجز سريع، أسعار تنافسية، وأسطول متنوع من السيارات الفاخرة والاقتصادية.`,
  };
}

export default async function CityPage({ params }) {
  const { city } = await params;
  const cityNames = {
    riyadh: "مدينة الرياض",
    jeddah: "مدينة جدة",
    eastern: "المنطقة الشرقية",
  };
  const cityName = cityNames[city] || city;

  const citySchemas = {
    riyadh: {
      "@context": "https://schema.org",
      "@type": "AutoRental",
      name: "تأجير سيارات الرياض - C4R",
      url: "https://c4rplatform.com/riyadh",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Riyadh",
        addressRegion: "Riyadh",
        addressCountry: "SA",
      },
    },
    jeddah: {
      "@context": "https://schema.org",
      "@type": "AutoRental",
      name: "تأجير سيارات جدة - C4R",
      url: "https://c4rplatform.com/jeddah",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jeddah",
        addressRegion: "Makkah Region",
        addressCountry: "SA",
      },
    },
  };

  const schema = citySchemas[city];

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <CityPageClient city={city} cityName={cityName} />
    </>
  );
}
