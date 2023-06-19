import { type AppType } from "next/dist/shared/lib/utils";
// usingExtBackend
import { QueryClient, QueryClientProvider } from "react-query";
// endUsingExtBackend

// usingRecoil
import { RecoilRoot } from "recoil";
// endUsingRecoil

import Layout from "~/components/layout/Layout";
// usingTrpc
import { api } from "~/utils/api";
// endUsingTrpc
import "~/styles/globals.scss";
// usingTailwind
import "~/styles/tailwind.css";

// endUsingTailwind

// usingExtBackend
const queryClient = new QueryClient();
// endUsingExtBackend

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    // usingRecoil
    <RecoilRoot>
      {/* endUsingRecoil */}

      {/* usingExtBackend */}
      <QueryClientProvider client={queryClient}>
        {/* endUsingExtBackend */}

        <Layout>
          <Component {...pageProps} />
        </Layout>

        {/* usingExtBackend */}
      </QueryClientProvider>
      {/* endUsingExtBackend */}

      {/* usingRecoil */}
    </RecoilRoot>
    // endUsingRecoil
  );
};

// usingTrpc
export default api.withTRPC(MyApp);
// endUsingTrpc

// notUsingTrpc
export default MyApp;
// endNotUsingTrpc
