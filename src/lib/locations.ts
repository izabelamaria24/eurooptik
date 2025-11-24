export type ClinicLocation = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  schedule: string;
  image: string;
  mapUrl: string;
};

export const clinicLocations: ClinicLocation[] = [
  {
    id: "bacau-clinica",
    name: "Clinica Bacău",
    address: "Str. Ștefan cel Mare nr. 7",
    phone: "0760 676 303",
    email: "eurooptik_bc@yahoo.com",
    schedule: "Luni - Vineri · 09:00 - 17:00",
    image: "/images/clinica_bacau.jpg",
    mapUrl: "https://g.co/kgs/CF3ZXSp",
  },
  {
    id: "bacau",
    name: "Cabinet Bacău",
    address: "Str. Războieni nr. 7",
    phone: "0760 676 304",
    email: "eurooptik_vest@yahoo.com",
    schedule: "Luni - Vineri · 09:00 - 17:00",
    image: "/images/cabinet_bacau.jpg",
    mapUrl: "https://g.co/kgs/kF5B3ia",
  },
  {
    id: "moinesti",
    name: "Cabinet Moinești",
    address: "Str. T. Vladimirescu nr. 177",
    phone: "0760 676 308",
    email: "eurooptik_moinesti2@yahoo.com",
    schedule: "Luni - Vineri · 08:00 - 16:00",
    image: "/images/moinesti.jpeg",
    mapUrl: "https://g.co/kgs/5yqERUP",
  },
  {
    id: "comanesti",
    name: "Cabinet Comănești",
    address: "Str. Nicolae Ghica nr. 2",
    phone: "0760 676 309",
    email: "eurooptik_comanesti@yahoo.com",
    schedule: "Luni - Vineri · 09:00 - 17:00",
    image: "/images/locations/eurooptik_comanesti.png",
    mapUrl: "https://g.co/kgs/c5HFjzz",
  },
  {
    id: "onesti",
    name: "Cabinet Onești",
    address: "Str. Poștei nr. 6",
    phone: "0760 676 306",
    email: "eurooptik_onesti@yahoo.com",
    schedule: "Luni - Vineri · 09:00 - 17:00",
    image: "/images/onesti.jpg",
    mapUrl: "https://g.co/kgs/qbvbxa7",
  },
];

export const footerLinks = [
  { label: "Servicii", href: "#services" },
  { label: "Specialități", href: "#specializations" },
  { label: "Testimoniale", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
  { label: "Reels", href: "#reels" },
  { label: "Contact", href: "#locations" },
];

