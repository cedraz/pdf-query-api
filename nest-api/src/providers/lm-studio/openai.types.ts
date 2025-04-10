export interface OpenAIResponse {
  choices: Choice[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: Usage;
}

export interface Choice {
  finish_reason: string;
  index: number;
  logprobs: any;
  text: string;
}

export interface Usage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}
