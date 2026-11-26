import { fabricCategories } from "../data/sampleCatalog";

export default function FabricImage({ category, ...props }) {
  const fallback = fabricCategories.find((item) => item.name === category)?.image
    ?? fabricCategories.at(-1).image;

  return (
    <img
      {...props}
      src={props.src || fallback}
      onError={(event) => {
        if (event.currentTarget.src !== new URL(fallback, document.baseURI).href) {
          event.currentTarget.src = fallback;
        }
      }}
    />
  );
}
