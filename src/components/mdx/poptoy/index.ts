import { AgentContract } from "./agent-contract";
import { ArchitectureMap } from "./architecture-map";
import { DefenseLayers } from "./defense-layers";
import { ForgeGraph } from "./forge-graph";
import { GuardRails } from "./guard-rails";
import { ModerationPasses } from "./moderation-passes";
import { PoptoyLoop } from "./poptoy-loop";
import { ScopeChart } from "./scope-chart";
import { TargetVsPrototype } from "./target-vs-prototype";
import { Topology } from "./topology";
import { WhatRuns } from "./what-runs";

// The figures of the poptoy devlog, registered under a Poptoy prefix so their
// generic names never collide with another article's components.
export const poptoyFigures = {
  PoptoyAgentContract: AgentContract,
  PoptoyArchitectureMap: ArchitectureMap,
  PoptoyDefenseLayers: DefenseLayers,
  PoptoyForgeGraph: ForgeGraph,
  PoptoyGuardRails: GuardRails,
  PoptoyLoop,
  PoptoyModerationPasses: ModerationPasses,
  PoptoyScopeChart: ScopeChart,
  PoptoyTargetVsPrototype: TargetVsPrototype,
  PoptoyTopology: Topology,
  PoptoyWhatRuns: WhatRuns,
};
