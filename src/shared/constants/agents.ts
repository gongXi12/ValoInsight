/** Valorant agent data with UUIDs and icon URLs */
export interface AgentInfo {
  uuid: string
  name: string
  icon: string
  role: string
}

export const AGENTS: Record<string, AgentInfo> = {
  'e370fa57-4757-3604-3648-499e1f642d3f': { uuid: 'e370fa57-4757-3604-3648-499e1f642d3f', name: 'Gekko', icon: 'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png', role: 'Initiator' },
  'dade69b4-4f5a-8528-247b-219e5a1facd6': { uuid: 'dade69b4-4f5a-8528-247b-219e5a1facd6', name: 'Fade', icon: 'https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayicon.png', role: 'Initiator' },
  '5f8d3a7f-467b-97f3-062c-13acf203c006': { uuid: '5f8d3a7f-467b-97f3-062c-13acf203c006', name: 'Breach', icon: 'https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/displayicon.png', role: 'Initiator' },
  'cc8b64c8-4b25-4ff9-6e7f-37b4da43d235': { uuid: 'cc8b64c8-4b25-4ff9-6e7f-37b4da43d235', name: 'Deadlock', icon: 'https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/displayicon.png', role: 'Sentinel' },
  'b444168c-4e35-8076-db47-ef9bf368f384': { uuid: 'b444168c-4e35-8076-db47-ef9bf368f384', name: 'Tejo', icon: 'https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/displayicon.png', role: 'Initiator' },
  'f94c3b30-42be-e959-889c-5aa313dba261': { uuid: 'f94c3b30-42be-e959-889c-5aa313dba261', name: 'Raze', icon: 'https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/displayicon.png', role: 'Duelist' },
  '22697a3d-45bf-8dd7-4fec-84a9e28c69d7': { uuid: '22697a3d-45bf-8dd7-4fec-84a9e28c69d7', name: 'Chamber', icon: 'https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/displayicon.png', role: 'Sentinel' },
  '601dbbe7-43ce-be57-2a40-4abd24953621': { uuid: '601dbbe7-43ce-be57-2a40-4abd24953621', name: 'KAY/O', icon: 'https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/displayicon.png', role: 'Initiator' },
  '6f2a04ca-43e0-be17-7f36-b3908627744d': { uuid: '6f2a04ca-43e0-be17-7f36-b3908627744d', name: 'Skye', icon: 'https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/displayicon.png', role: 'Initiator' },
  '117ed9e3-49f3-6512-3ccf-0cada7e3823b': { uuid: '117ed9e3-49f3-6512-3ccf-0cada7e3823b', name: 'Cypher', icon: 'https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png', role: 'Sentinel' },
  '320b2a48-4d9b-a075-30f1-1f93a9b638fa': { uuid: '320b2a48-4d9b-a075-30f1-1f93a9b638fa', name: 'Sova', icon: 'https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png', role: 'Initiator' },
  '7c8a4701-4de6-9355-b254-e09bc2a34b72': { uuid: '7c8a4701-4de6-9355-b254-e09bc2a34b72', name: 'Miks', icon: 'https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/displayicon.png', role: 'Controller' },
  '1e58de9c-4950-5125-93e9-a0aee9f98746': { uuid: '1e58de9c-4950-5125-93e9-a0aee9f98746', name: 'Killjoy', icon: 'https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png', role: 'Sentinel' },
  '95b78ed7-4637-86d9-7e41-71ba8c293152': { uuid: '95b78ed7-4637-86d9-7e41-71ba8c293152', name: 'Harbor', icon: 'https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/displayicon.png', role: 'Controller' },
  'efba5359-4016-a1e5-7626-b1ae76895940': { uuid: 'efba5359-4016-a1e5-7626-b1ae76895940', name: 'Vyse', icon: 'https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/displayicon.png', role: 'Sentinel' },
  '707eab51-4836-f488-046a-cda6bf494859': { uuid: '707eab51-4836-f488-046a-cda6bf494859', name: 'Viper', icon: 'https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png', role: 'Controller' },
  'eb93336a-449b-9c1b-0a54-a891f7921d69': { uuid: 'eb93336a-449b-9c1b-0a54-a891f7921d69', name: 'Phoenix', icon: 'https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png', role: 'Duelist' },
  '92eeef5d-43b5-1d4a-8d03-b3927a09034b': { uuid: '92eeef5d-43b5-1d4a-8d03-b3927a09034b', name: 'Veto', icon: 'https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/displayicon.png', role: 'Sentinel' },
  '41fb69c1-4189-7b37-f117-bcaf1e96f1bf': { uuid: '41fb69c1-4189-7b37-f117-bcaf1e96f1bf', name: 'Astra', icon: 'https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/displayicon.png', role: 'Controller' },
  '9f0d8ba9-4140-b941-57d3-a7ad57c6b417': { uuid: '9f0d8ba9-4140-b941-57d3-a7ad57c6b417', name: 'Brimstone', icon: 'https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png', role: 'Controller' },
  '0e38b510-41a8-5780-5e8f-568b2a4f2d6c': { uuid: '0e38b510-41a8-5780-5e8f-568b2a4f2d6c', name: 'Iso', icon: 'https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/displayicon.png', role: 'Duelist' },
  '1dbf2edd-4729-0984-3115-daa5eed44993': { uuid: '1dbf2edd-4729-0984-3115-daa5eed44993', name: 'Clove', icon: 'https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/displayicon.png', role: 'Controller' },
  'bb2a4828-46eb-8cd1-e765-15848195d751': { uuid: 'bb2a4828-46eb-8cd1-e765-15848195d751', name: 'Neon', icon: 'https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/displayicon.png', role: 'Duelist' },
  '7f94d92c-4234-0a36-9646-3a87eb8b5c89': { uuid: '7f94d92c-4234-0a36-9646-3a87eb8b5c89', name: 'Yoru', icon: 'https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/displayicon.png', role: 'Duelist' },
  'df1cb487-4902-002e-5c17-d28e83e78588': { uuid: 'df1cb487-4902-002e-5c17-d28e83e78588', name: 'Waylay', icon: 'https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/displayicon.png', role: 'Duelist' },
  '569fdd95-4d10-43ab-ca70-79becc718b46': { uuid: '569fdd95-4d10-43ab-ca70-79becc718b46', name: 'Sage', icon: 'https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png', role: 'Sentinel' },
  'a3bfb853-43b2-7238-a4f1-ad90e9e46bcc': { uuid: 'a3bfb853-43b2-7238-a4f1-ad90e9e46bcc', name: 'Reyna', icon: 'https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png', role: 'Duelist' },
  '8e253930-4c05-31dd-1b6c-968525494517': { uuid: '8e253930-4c05-31dd-1b6c-968525494517', name: 'Omen', icon: 'https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png', role: 'Controller' },
  'add6443a-41bd-e414-f6ad-e58d267f4e95': { uuid: 'add6443a-41bd-e414-f6ad-e58d267f4e95', name: 'Jett', icon: 'https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png', role: 'Duelist' },
}

/** Get agent info by UUID */
export function getAgentByUuid(uuid: string): AgentInfo | null {
  return AGENTS[uuid] || null
}

/** Get agent icon URL by UUID */
export function getAgentIcon(uuid: string): string {
  return AGENTS[uuid]?.icon || ''
}

/** Get agent name by UUID */
export function getAgentName(uuid: string): string {
  return AGENTS[uuid]?.name || uuid
}

/** Role icons (SVG paths) */
export const ROLE_ICONS: Record<string, string> = {
  Duelist: '⚔️',
  Initiator: '🎯',
  Controller: '🛡️',
  Sentinel: '🔒',
}
