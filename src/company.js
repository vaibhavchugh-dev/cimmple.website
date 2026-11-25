export const company = {
  brand: 'Cimmple',
  legalName: 'Cimmplex Innovations LLP',
  identificationNumber: 'ACO-4148',
  email: 'contact@cimmple.com',
  addressLines: [
    '208 Trump Tower, Omaxe New Heights',
    'Sector 78, Faridabad, Haryana 121010',
    'India',
  ],
  addressLocality: 'Faridabad',
  addressRegion: 'Haryana',
  postalCode: '121010',
  addressCountry: 'IN',
  streetAddress: '208 Trump Tower, Omaxe New Heights, Sector 78',
  mapsQuery: '208 Trump Tower, Omaxe New Heights, Sector 78, Faridabad, Haryana 121010, India',
  mapsLat: 28.385005,
  mapsLng: 77.36895,
  markets: 'United States, Canada, and India',
  responsePromise: 'We typically reply within one business day.',
  privacyUpdated: '25 November 2026',
};

export const mapsEmbedSrc='https://maps.google.com/maps?q='+company.mapsLat+','+company.mapsLng+'&hl=en&z=16&output=embed';
export const mapsLink='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(company.mapsQuery);
