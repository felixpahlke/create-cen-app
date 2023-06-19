import { type AppType } from "next/dist/shared/lib/utils";
import Layout from "~/components/layout/Layout";
import { api } from "~/utils/api";
import "~/styles/globals.scss";
import "~/styles/tailwind.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default api.withTRPC(MyApp);
