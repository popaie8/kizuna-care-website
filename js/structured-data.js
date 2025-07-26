// Structured Data for Organization
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "絆訪問介護サービス",
    "alternateName": "合同会社K&Kサービス",
    "url": "https://kizuna-houmon.jp",
    "logo": "https://kizuna-houmon.jp/images/logo1.png",
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+81-3-6820-5308",
        "contactType": "customer service",
        "areaServed": "JP",
        "availableLanguage": "Japanese"
    },
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "南小岩７丁目３７番地５号 101号室",
        "addressLocality": "江戸川区",
        "addressRegion": "東京都",
        "postalCode": "133-0056",
        "addressCountry": "JP"
    },
    "sameAs": []
};

// Structured Data for Local Business
const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "絆訪問介護サービス",
    "image": "https://kizuna-houmon.jp/images/logo1.png",
    "@id": "https://kizuna-houmon.jp",
    "url": "https://kizuna-houmon.jp",
    "telephone": "+81-3-6820-5308",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "南小岩７丁目３７番地５号 101号室",
        "addressLocality": "江戸川区",
        "addressRegion": "東京都",
        "postalCode": "133-0056",
        "addressCountry": "JP"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 35.7323,
        "longitude": 139.8813
    },
    "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
    },
    "priceRange": "¥",
    "servesCuisine": "",
    "acceptsReservations": "True"
};

// Insert structured data into the page
function insertStructuredData() {
    const scripts = [organizationSchema, localBusinessSchema];
    scripts.forEach(schema => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    });
}

// Call on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertStructuredData);
} else {
    insertStructuredData();
}