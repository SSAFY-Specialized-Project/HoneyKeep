import { Layout } from "@/shared/ui";
import { BasicHeader } from "@/widgets";
import { GlobalNavigation } from "@/widgets/navigation/ui";

const BaseLayout = () => {
  return (
    <Layout headerSlot={<BasicHeader />} navbarSlot={<GlobalNavigation />} />
  );
};

export default BaseLayout;
