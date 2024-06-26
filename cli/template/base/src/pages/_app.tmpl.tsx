import { type AppType } from "next/dist/shared/lib/utils";

// $with: extBackend
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// $end: extBackend

// $with: recoil
import { RecoilRoot } from "recoil";
// $end: recoil

import Layout from "~/components/layout/Layout";
// $with: trpc
import { api } from "~/utils/api";
// $end: trpc
import "~/styles/globals.scss";
// $with: tailwind
import "~/styles/tailwind.css";

// $end: tailwind

// $with: extBackend
const queryClient = new QueryClient();
// $end: extBackend

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    // $with: recoil
    <RecoilRoot>
      {/* $end: recoil */}

      {/* $with: extBackend */}
      <QueryClientProvider client={queryClient}>
        {/* $end: extBackend */}

        <Layout>
          <Component {...pageProps} />
        </Layout>

        {/* $with: extBackend */}
      </QueryClientProvider>
      {/* $end: extBackend */}

      {/* $with: recoil */}
    </RecoilRoot>
    // $end: recoil
  );
};

// $with: trpc
export default api.withTRPC(MyApp);
// $end: trpc

// $with: !trpc
export default MyApp;
// $end: !trpc
