import { Suspense } from "react";
import ClientPage from "./page.client";

export default function page() {
  return (
    <div className="container">
      <Suspense>
        <ClientPage />
      </Suspense>
    </div>
  );
}
