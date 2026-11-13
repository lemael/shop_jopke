import { apiClient } from "./client";
import type { PortoKonfiguration } from "@/types/porto";

export const portoApi = {
  async getKonfiguration(): Promise<PortoKonfiguration> {
    return apiClient<PortoKonfiguration>("/porto/regeln");
  },
};
