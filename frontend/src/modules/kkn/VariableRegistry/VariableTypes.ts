export type VariableType = 'STRING' | 'NUMBER' | 'DATETIME' | 'CURRENCY' | 'LIST';
export type VariableStatus = 'ACTIVE' | 'INACTIVE';

export interface IVariable {
  id: string;
  code: string;
  displayName: string;
  group: string;
  type: VariableType;
  sampleValue: string;
  description: string;
  status: VariableStatus;
  isInUse?: boolean;
}

