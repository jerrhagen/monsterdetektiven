import { case1 } from "./case1-toystore";
import { case2 } from "./case2-bakery";
import { case3 } from "./case3-library";
import { case4 } from "./case4-forest";
import { case5 } from "./case5-clocktower";
import { case6 } from "./case6-festival";
import type { Case } from "./types";

/** All cases, in the order they are played. */
export const cases: Case[] = [case1, case2, case3, case4, case5, case6];
