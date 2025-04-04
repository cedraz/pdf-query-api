export interface LMStudioResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
  stats: Stats;
  system_fingerprint: string;
}

export interface Choice {
  index: number;
  logprobs: any;
  finish_reason: string;
  message: Message;
}

export interface Message {
  role: string;
  content: string;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Stats {}
