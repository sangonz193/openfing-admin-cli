import { identity } from "lodash";

export const getCommonVisibility = (visibility: "public" | "hidden" | "disabled") =>
	identity<Record<typeof visibility, "PUBLIC" | "DISABLED" | "HIDDEN">>({
		public: "PUBLIC",
		disabled: "DISABLED",
		hidden: "HIDDEN",
	})[visibility];
