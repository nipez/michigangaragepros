import { HomePage } from "@/components/HomePage";
import { getHomepageCities } from "@/data/cities";
import { getTopCompanies } from "@/data/companies";

export default function Page() {
  return (
    <HomePage
      topCompanies={getTopCompanies(3)}
      homepageCities={getHomepageCities()}
    />
  );
}
