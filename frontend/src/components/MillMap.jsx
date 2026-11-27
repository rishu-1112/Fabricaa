import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import ScrollReveal from "./ScrollRevealAbout";

const millIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapResizeFix() {
  const map = useMap();
  useEffect(() => {
    const timers = [50, 250, 600].map((delay) => setTimeout(() => map.invalidateSize(), delay));
    return () => timers.forEach(clearTimeout);
  }, [map]);
  return null;
}

const millLocation = {
  name: "Fabricaa Textile Hub (sample)",
  address: "Ring Road Textile Cluster, Surat, Gujarat 395002",
  note: "Illustrative map pin for the demo storefront — not a live mill address.",
  position: [21.1702, 72.8311],
  mapsUrl: "https://www.openstreetmap.org/?mlat=21.1702&mlon=72.8311#map=14/21.1702/72.8311",
};

export default function MillMap({ compact = false }) {
  return (
    <section id="location" className={`scroll-mt-24 ${compact ? "py-8" : "pt-6 pb-14 sm:pt-8 sm:pb-16"}`}>
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <ScrollReveal className="mb-6 max-w-2xl">
          <p className="theme-brand mb-3 text-xs font-semibold uppercase tracking-[0.16em]">Visit</p>
          <h2 className="display-title theme-text text-4xl sm:text-5xl">Find our mill</h2>
          <p className="theme-muted mt-3">{millLocation.note}</p>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
          <ScrollReveal className="surface rounded-3xl border p-6 shadow-sm">
            <p className="theme-soft inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
              Sample location
            </p>
            <h3 className="theme-text mt-4 text-xl font-semibold">{millLocation.name}</h3>
            <p className="theme-muted mt-3">{millLocation.address}</p>
            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="theme-brand font-semibold">Hours</dt>
                <dd className="theme-muted">Mon–Sat · 10:00–18:00 IST (illustrative)</dd>
              </div>
              <div>
                <dt className="theme-brand font-semibold">Appointments</dt>
                <dd className="theme-muted">Swatch visits by prior request through Contact.</dd>
              </div>
            </dl>
            <a
              href={millLocation.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-8 inline-flex"
            >
              Open sample pin in OpenStreetMap
            </a>
          </ScrollReveal>

          <ScrollReveal delay={0.08} className="surface overflow-hidden rounded-3xl border shadow-sm">
            <div
              role="region"
              aria-label="Sample map showing an illustrative Fabricaa mill pin in Surat"
              className="contents"
            >
            <div className="surface-muted border-b px-4 py-2 text-xs theme-muted" style={{ borderColor: "var(--fb-border)" }}>
              Interactive map — use tab to reach zoom controls; scroll zoom is disabled.
            </div>
            <MapContainer
              center={millLocation.position}
              zoom={13}
              scrollWheelZoom={false}
              keyboard
              className="h-[22rem] w-full sm:h-[26rem] z-0"
            >
              <MapResizeFix />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={millLocation.position} icon={millIcon} keyboard alt="Sample Fabricaa mill marker">
                <Popup>
                  <strong>{millLocation.name}</strong>
                  <br />
                  {millLocation.address}
                  <br />
                  <em>Demo pin only</em>
                </Popup>
              </Marker>
            </MapContainer>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
