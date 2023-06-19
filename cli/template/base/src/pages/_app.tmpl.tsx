import { type AppType } from "next/dist/shared/lib/utils";
// $start: extBackend
import { QueryClient, QueryClientProvider } from "react-query";
// $end: extBackend

// $start: recoil
import { RecoilRoot } from "recoil";
// $end: recoil

import Layout from "~/components/layout/Layout";
// $start: trpc
import { api } from "~/utils/api";
// $end: trpc
import "~/styles/globals.scss";
// $start: tailwind
import "~/styles/tailwind.css";

// $end: tailwind

// $start: extBackend
const queryClient = new QueryClient();
// $end: extBackend

// $start: recoil && !extBackend
console.log("hi");
// $end: recoil && !extBackend

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    // $start: recoil
    <RecoilRoot>
      {/* $end: recoil */}

      {/* $start: extBackend */}
      <QueryClientProvider client={queryClient}>
        {/* $end: extBackend */}

        <Layout>
          <Component {...pageProps} />
        </Layout>

        {/* $start: extBackend */}
      </QueryClientProvider>
      {/* $end: extBackend */}

      {/* $start: recoil */}
    </RecoilRoot>
    // $end: recoil
  );
};

// $start: trpc
export default api.withTRPC(MyApp);
// $end: trpc

// $start: !trpc
export default MyApp;
// $end: !trpc
