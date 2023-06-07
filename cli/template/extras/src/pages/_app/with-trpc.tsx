import { type AppType } from "next/app";
import { RecoilRoot } from "recoil";
import Layout from "~/components/layout/Layout";
import { api } from "~/utils/api";
import "~/styles/globals.scss";
import "~/styles/tailwind.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  );
};

export default api.withTRPC(MyApp);
